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
    <div className="flex h-screen bg-gray-50">
      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Chat Support</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {rooms.length === 0 && (
            <div className="p-4 text-center text-gray-400 text-sm">
              No other admins found
            </div>
          )}
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                currentRoom === room.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
              onClick={() => {
                setCurrentRoom(room.id);
                setSidebarOpen(false);
              }}
            >
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-full p-2 mr-3">
                  <FiUser className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    Click to chat
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden mr-3 text-gray-500 hover:text-gray-700"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-full p-2 mr-3">
                <FiUser className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {selectedAdmin?.name || "Select a conversation"}
                </h3>
                <p
                  className={`text-xs ${isConnected ? "text-green-500" : "text-red-500"}`}
                >
                  {isConnected ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <FiSearch size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <FiBell size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <FiMoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}

            {messages.map((message) => {
              const isMe = message.senderId === userId;
              const senderName = userMap[message.senderId];

              return (
                <div
                  key={message.id}
                  className={`flex items-end mb-4 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <div className="w-8 h-8 shrink-0 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <FiUser className="text-white" size={14} />
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isMe
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                    }`}
                  >
                    {!isMe && senderName && (
                      <p className="text-xs font-semibold text-blue-600 mb-1">
                        {senderName}
                      </p>
                    )}
                    <p>{message.content}</p>
                    <div
                      className={`flex items-center gap-1 text-xs mt-1 ${
                        isMe ? "text-blue-200 justify-end" : "text-gray-500"
                      }`}
                    >
                      <span>{formatTimestamp(message.timestamp)}</span>
                      {isMe && (
                        <span title={message.isRead ? "อ่านแล้ว" : "ส่งแล้ว"}>
                          {message.isRead ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {typingUsers.size > 0 && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            {!isConnected && (
              <div className="text-center text-red-500 text-sm mb-2">
                Connecting to chat server...
              </div>
            )}
            <div className="flex items-center">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <FiPaperclip size={20} />
              </button>
              <div className="flex-1 mx-2">
                <textarea
                  value={newMessage}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={1}
                  disabled={!isConnected}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className={`p-2 rounded-full ${
                  newMessage.trim() && isConnected
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
