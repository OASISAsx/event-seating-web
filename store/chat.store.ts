import { io } from "socket.io-client";
import { create } from "zustand";
import { getChatMessages, getChatRoomStats, getAdmins } from "@/services/chat.service";
import { ChatMessage, ChatRoom, UseChatStore } from "@/types/chat.interface";

export const useChatStore = create<UseChatStore>((set, get) => ({
  // State
  socket: null,
  isConnected: false,
  userId: "",
  userName: "",
  rooms: [],
  currentRoom: null,
  messages: [],
  userMap: {},
  typingUsers: new Set<string>(),
  loading: false,

  // ── Connection ──────────────────────────────────────────────────────────────

  connect: (userId: string, userName?: string) => {
    const existing = get().socket;
    if (existing?.connected) return;

    // Disconnect old socket if exists
    existing?.disconnect();

    const socketUrl =
      process.env.NEXT_PUBLIC_CHAT_WS_URL || "http://localhost:8080/chat";

    const socketInstance = io(socketUrl, {
      query: { userId },
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    set({ userId, userName: userName || userId });

    socketInstance.on("connect", () => {
      set({ isConnected: true });
      console.log("Chat connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      set({ isConnected: false });
      console.log("Chat disconnected");
    });

    // รับข้อความใหม่
    socketInstance.on(
      "new-message",
      (msg: Record<string, unknown>) => {
        get().addMessage({
          id:
            (msg.id as string) ??
            (msg._id as string) ??
            `msg-${Date.now()}`,
          roomId: (msg.roomId as string) ?? "",
          senderId: (msg.senderId as string) ?? "",
          content: (msg.content as string) ?? "",
          timestamp: (msg.timestamp as Date) ?? new Date(),
          type: (msg.type as ChatMessage["type"]) ?? "message",
        });
      },
    );

    // รับการแจ้งเตือนมีคนเข้าห้อง → mark ข้อความของเราเป็นอ่านแล้ว
    socketInstance.on(
      "user-joined",
      (data: { userId: string; roomId: string; timestamp: Date }) => {
        const { currentRoom, userId: myId } = get();
        if (data.roomId === currentRoom && data.userId !== myId) {
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.senderId === myId ? { ...msg, isRead: true } : msg,
            ),
          }));
        }
      },
    );

    // รับการแจ้งเตือนมีคนออกจากห้อง
    socketInstance.on(
      "user-left",
      (data: { userId: string; roomId: string }) => {
        get().addMessage({
          id: `leave-${Date.now()}`,
          roomId: data.roomId,
          senderId: data.userId,
          content: `${data.userId} left the chat`,
          timestamp: new Date(),
          type: "leave",
        });
      },
    );

    // รับสถานะการพิมพ์
    socketInstance.on(
      "user-typing",
      (data: { userId: string; roomId: string; isTyping: boolean }) => {
        const { currentRoom, userId: myId } = get();
        if (data.roomId !== currentRoom || data.userId === myId) return;

        set((state) => {
          const next = new Set(state.typingUsers);
          if (data.isTyping) {
            next.add(data.userId);
          } else {
            next.delete(data.userId);
          }
          return { typingUsers: next };
        });
      },
    );

    // รับสถานะอ่านข้อความ
    socketInstance.on(
      "messages-read",
      (data: { roomId: string; userId: string }) => {
        const { currentRoom, userId: myId } = get();
        if (data.roomId !== currentRoom || data.userId === myId) return;

        // ข้อความที่เราส่ง → ถูกอ่านแล้ว
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.senderId === myId ? { ...msg, isRead: true } : msg,
          ),
        }));
      },
    );

    set({ socket: socketInstance });
  },

  disconnect: () => {
    const { socket } = get();
    socket?.disconnect();
    set({
      socket: null,
      isConnected: false,
      messages: [],
      currentRoom: null,
      typingUsers: new Set(),
    });
  },

  // ── Room ────────────────────────────────────────────────────────────────────

  addRoom: (room: ChatRoom) => {
    set((state) => {
      const exists = state.rooms.some((r) => r.id === room.id);
      if (exists) return state;
      return { rooms: [...state.rooms, room] };
    });
  },

  fetchRoomStats: async (roomId: string) => {
    try {
      const res = await getChatRoomStats(roomId);
      const stats = res.data ?? res;
      const map: Record<string, string> = { ...get().userMap };
      if (Array.isArray(stats)) {
        stats.forEach((s: { senderId: string; username: string }) => {
          if (s.senderId && s.username) {
            map[s.senderId] = s.username;
          }
        });
      }
      set({ userMap: map });
    } catch {
      // stats ไม่สำคัญ ถ้า fail ก็ข้ามไป
    }
  },

  fetchAdmins: async () => {
    const { userId } = get();
    if (!userId) return;
    try {
      const res = await getAdmins(userId);
      const data = res.data ?? res;
      const list = Array.isArray(data) ? data : [];
      const rooms: ChatRoom[] = list.map(
        (admin: { id: string; username: string; roomId: string }) => ({
          id: admin.roomId,
          name: admin.username,
        }),
      );
      set({ rooms });
    } catch {
      console.error("Failed to fetch admins");
    }
  },

  joinRoom: (roomId: string) => {
    const { socket, isConnected, userId, currentRoom } = get();
    if (!socket || !isConnected) return;

    // ออกจากห้องเก่า
    if (currentRoom) {
      socket.emit("leave-room", { roomId: currentRoom });
    }

    socket.emit(
      "join-room",
      { roomId, userId },
      (response: { status: string; message?: string }) => {
        if (response?.status === "success") {
          console.log("Joined room:", roomId);
        } else {
          console.error("Failed to join room:", response?.message);
        }
      },
    );

    set({ currentRoom: roomId, messages: [], typingUsers: new Set() });

    // โหลดข้อความเก่า + ข้อมูล user แล้ว mark เป็นอ่านแล้ว
    Promise.all([
      get().fetchMessages(roomId),
      get().fetchRoomStats(roomId),
    ]).then(() => {
      get().markAsRead(roomId);
    });
  },

  leaveRoom: (roomId: string) => {
    const { socket } = get();
    socket?.emit("leave-room", { roomId });

    if (get().currentRoom === roomId) {
      set({ currentRoom: null, messages: [], typingUsers: new Set() });
    }
  },

  setCurrentRoom: (roomId: string) => {
    get().joinRoom(roomId);
  },

  // ── Messages ────────────────────────────────────────────────────────────────

  fetchMessages: async (roomId: string) => {
    try {
      set({ loading: true });
      const res = await getChatMessages(roomId);
      const body = res.data ?? res;
      const raw = body.messages ?? body.data ?? body;
      const data = Array.isArray(raw)
        ? raw
            .filter((msg: Record<string, unknown>) => msg.type === "message" || !msg.type)
            .map((msg: Record<string, unknown>) => ({
              id: String(msg.id ?? msg._id ?? `msg-${Date.now()}-${Math.random()}`),
              roomId: String(msg.roomId ?? roomId),
              senderId: String(msg.senderId ?? ""),
              content: String(msg.content ?? ""),
              timestamp: (msg.timestamp ?? msg.createdAt ?? new Date()) as Date | string,
              type: "message" as const,
              isRead: Boolean(msg.isRead ?? false),
            }))
        : [];

      // Build userMap from participants if available in response
      const participants = body.participants;
      if (Array.isArray(participants)) {
        const map: Record<string, string> = { ...get().userMap };
        participants.forEach((p: { senderId: string; username: string }) => {
          if (p.senderId && p.username) {
            map[p.senderId] = p.username;
          }
        });
        set({ messages: data, userMap: map, loading: false });
      } else {
        set({ messages: data, loading: false });
      }
    } catch {
      set({ messages: [], loading: false });
    }
  },

  sendMessage: (content: string) => {
    const { socket, isConnected, currentRoom, userId } = get();
    if (!content.trim() || !socket || !isConnected || !currentRoom) return;

    socket.emit(
      "send-message",
      { roomId: currentRoom, content: content.trim(), senderId: userId },
      (response: { status: string; message?: string }) => {
        if (response?.status === "error") {
          console.error("Failed to send message:", response.message);
        }
      },
    );
  },

  addMessage: (message: ChatMessage) => {
    // ไม่เก็บ join/leave ใน messages
    if (message.type === "join" || message.type === "leave") return;

    set((state) => {
      if (state.currentRoom && message.roomId !== state.currentRoom)
        return state;

      const exists = state.messages.some((m) => m.id === message.id);
      if (exists) return state;

      return { messages: [...state.messages, message] };
    });
  },

  markAsRead: (roomId: string) => {
    const { socket, isConnected, userId } = get();
    if (!socket || !isConnected) return;

    socket.emit("mark-read", { roomId, userId });

    // อัปเดต state ให้ข้อความของคนอื่นเป็น read ทั้งหมด
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.senderId !== userId ? { ...msg, isRead: true } : msg,
      ),
    }));
  },

  // ── Typing ──────────────────────────────────────────────────────────────────

  emitTyping: (isTyping: boolean) => {
    const { socket, isConnected, currentRoom } = get();
    if (!socket || !isConnected || !currentRoom) return;
    socket.emit("typing", { roomId: currentRoom, isTyping });
  },

  // ── Reset ───────────────────────────────────────────────────────────────────

  reset: () => {
    get().disconnect();
    set({
      userId: "",
      userName: "",
      rooms: [],
      currentRoom: null,
      messages: [],
      userMap: {},
      typingUsers: new Set(),
      loading: false,
    });
  },
}));
