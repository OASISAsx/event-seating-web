"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiPaperclip,
  FiMoreVertical,
  FiSearch,
  FiBell,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useChatStore } from "@/store/chat.store";

const Chat = () => {
  const { data: session } = useSession();

  // Store state
  const {
    isConnected,
    currentRoom,
    messages,
    typingUsers,
    userId,
    rooms,
    userMap,
    setCurrentRoom,
    sendMessage,
    emitTyping,
  } = useChatStore();

  // Local UI state
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef<boolean>(false);

  // Connect socket when session is available
  useEffect(() => {
    if (session?.user?.id) {
      const { connect } = useChatStore.getState();
      connect(session.user.id, session.user.name);
    }

    return () => {
      useChatStore.getState().disconnect();
    };
  }, [session?.user?.id, session?.user?.name]);

  // Fetch admin list as soon as session is available
  useEffect(() => {
    if (session?.user?.id) {
      useChatStore.getState().fetchAdmins(session.user.id);
    }
  }, [session?.user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && isConnected) {
      sendMessage(newMessage);
      setNewMessage("");
      isTypingRef.current = false;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);

    if (isConnected) {
      if (!isTypingRef.current && e.target.value.trim() !== "") {
        isTypingRef.current = true;
        emitTyping(true);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
        emitTyping(false);
      }, 2000);
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Find currently selected admin name from rooms
  const selectedAdmin = rooms.find((r) => r.id === currentRoom);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-[1px] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-800/80 bg-slate-900/95 shadow-2xl shadow-black/30 backdrop-blur transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">
            Chat Support
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 transition hover:text-slate-200 md:hidden"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="border-b border-slate-800 p-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2 pr-4 pl-10 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="h-[calc(100vh-140px)] overflow-y-auto">
          {rooms.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500">
              No other admins found
            </div>
          )}
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`cursor-pointer border-b border-slate-800/80 p-4 transition-colors ${
                currentRoom === room.id
                  ? "border-l-4 border-l-cyan-400 bg-slate-800/80"
                  : "hover:bg-slate-800/60"
              }`}
              onClick={() => {
                setCurrentRoom(room.id);
                setSidebarOpen(false);
              }}
            >
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 p-2 shadow-lg shadow-cyan-900/40">
                  <FiUser className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-slate-100">
                    {room.name}
                  </h3>
                  <p className="truncate text-xs text-slate-400">Click to chat</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 p-4 backdrop-blur">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-3 text-slate-400 transition hover:text-slate-200 md:hidden"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 p-2 shadow-lg shadow-cyan-900/40">
                <FiUser className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">
                  {selectedAdmin?.name || "Select a conversation"}
                </h3>
                <p
                  className={`text-xs ${isConnected ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {isConnected ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="text-slate-400 transition hover:text-slate-200">
              <FiSearch size={20} />
            </button>
            <button className="text-slate-400 transition hover:text-slate-200">
              <FiBell size={20} />
            </button>
            <button className="text-slate-400 transition hover:text-slate-200">
              <FiMoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,_#172554_0%,_#020617_45%,_#020617_100%)] p-4">
          <div className="mx-auto max-w-3xl">
            {messages.length === 0 && (
              <div className="mt-8 text-center text-slate-400">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}

            {messages.map((message) => {
              const isMe = message.senderId === userId;
              const senderName = userMap[message.senderId];

              return (
                <div
                  key={message.id}
                  className={`mb-4 flex items-end ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500">
                      <FiUser className="text-white" size={14} />
                    </div>
                  )}
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2.5 shadow-lg lg:max-w-md ${
                      isMe
                        ? "rounded-br-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-900/40"
                        : "rounded-bl-md border border-slate-700 bg-slate-800/85 text-slate-100 shadow-black/30"
                    }`}
                  >
                    {!isMe && senderName && (
                      <p className="mb-1 text-xs font-semibold text-cyan-400">
                        {senderName}
                      </p>
                    )}
                    <p>{message.content}</p>
                    <div
                      className={`mt-1 flex items-center gap-1 text-xs ${
                        isMe ? "justify-end text-cyan-100/90" : "text-slate-400"
                      }`}
                    >
                      <span>{formatTimestamp(message.timestamp)}</span>
                      {isMe && (
                        <span title={message.isRead ? "Read" : "Sent"}>
                          {message.isRead ? "\u2713\u2713" : "\u2713"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {typingUsers.size > 0 && (
              <div className="mb-4 flex justify-start">
                <div className="rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-2">
                  <div className="flex space-x-1">
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-800 bg-slate-900/90 p-4">
          <div className="mx-auto max-w-3xl">
            {!isConnected && (
              <div className="mb-2 text-center text-sm text-rose-400">
                Connecting to chat server...
              </div>
            )}
            <div className="flex items-center">
              <button className="p-2 text-slate-400 transition hover:text-slate-200">
                <FiPaperclip size={20} />
              </button>
              <div className="mx-2 flex-1">
                <textarea
                  value={newMessage}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500/60 focus:outline-none"
                  rows={1}
                  disabled={!isConnected}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className={`rounded-full p-2 transition ${
                  newMessage.trim() && isConnected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:brightness-110"
                    : "cursor-not-allowed bg-slate-800 text-slate-600"
                }`}
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
