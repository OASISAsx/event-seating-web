import { Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  timestamp: Date | string;
  type: "message" | "join" | "leave";
  isRead?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt?: string;
}

export interface ChatRoomStats {
  senderId: string;
  username: string;
  messageCount: number;
}

export interface UseChatStore {
  // Connection
  socket: Socket | null;
  isConnected: boolean;

  // User
  userId: string;
  userName: string;

  // Room
  rooms: ChatRoom[];
  currentRoom: string | null;

  // Messages
  messages: ChatMessage[];

  // User map (senderId → username)
  userMap: Record<string, string>;

  // Typing
  typingUsers: Set<string>;

  // Loading
  loading: boolean;

  // Actions - Connection
  connect: (userId: string, userName?: string) => void;
  disconnect: () => void;

  // Actions - Room
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  setCurrentRoom: (roomId: string) => void;
  addRoom: (room: ChatRoom) => void;
  fetchRoomStats: (roomId: string) => Promise<void>;
  fetchAdmins: (adminId?: string) => Promise<void>;

  // Actions - Messages
  sendMessage: (content: string) => void;
  fetchMessages: (roomId: string) => Promise<void>;
  addMessage: (message: ChatMessage) => void;
  markAsRead: (roomId: string) => void;

  // Actions - Typing
  emitTyping: (isTyping: boolean) => void;

  // Actions - Reset
  reset: () => void;
}
