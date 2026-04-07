import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiEdit2 } from "react-icons/fi";
import ChatMessageBubble from "./ChatMessage";
import type { ChatMessage } from "@/models/chat.type";
import { useChatMessages } from "@/hooks/api/useChat";
import { useSocket } from "@/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [message, setMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const socket = useSocket();
  const { user } = useAuth();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { data: messages } = useChatMessages("general");

  // WebSocket figyelés az új üzenetekre
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (newMessage: ChatMessage) => {
      queryClient.setQueryData(["chat", "general"], (oldData: ChatMessage[] | undefined) => {
        return oldData ? [...oldData, newMessage] : [newMessage];
      });
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    socket.on("message_updated", (updatedMessage: ChatMessage) => {
      queryClient.setQueryData(["chat", "general"], (oldData: ChatMessage[] | undefined) => {
        return oldData?.map((m) => (m._id === updatedMessage._id ? updatedMessage : m)) ?? oldData;
      });
    });

    socket.on("user_typing", ({ username, isTyping }) => {
      setTypingUser(isTyping ? username : null);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_updated");
      socket.off("user_typing");
    };
  }, [socket, isOpen, queryClient]);

  // Textarea magasságának automatikus állítása
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  useEffect(() => {
    if (isOpen && socket) {
      socket.emit("join_room", "general");
    }
  }, [isOpen, socket]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleTyping = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
      if (!socket) return;
      socket.emit("typing_start", "general");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        socket.emit("typing_stop", "general");
      }, 2000); // 2mp tétlenség után leáll
    };
  }, [socket]);

  const handleStartEdit = (msg: ChatMessage) => {
    setEditingMessage(msg);
    setMessage(msg.message);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setMessage("");
  };

  const handleSendMessage = () => {
    if (!message.trim() || !socket) return;

    if (editingMessage) {
      socket.emit("edit_message", {
        messageId: editingMessage._id,
        room: "general",
        newMessage: message.trim(),
      });
      setEditingMessage(null);
    } else {
      socket.emit("send_message", { message: message.trim(), room: "general" });
    }
    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 bg-surface border border-(--color-border) rounded-2xl shadow-xl w-[90vw] sm:w-[350px] flex flex-col overflow-hidden"
            style={{ height: "450px", maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Header */}
            <div className="bg-(--color-panel-header-bg) px-4 py-3 border-b border-(--color-border) flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <h3 className="text-white font-medium text-sm tracking-wide">Élő Chat</h3>
              </div>
              <button
                onClick={toggleChat}
                className="text-text-muted hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
                title="Bezárás"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto bg-panel-bg flex flex-col gap-4 min-h-0 scrollbar-hide">
              {messages && messages.length > 0 ? (
                messages.map((msg) => {
                  const isOwn =
                    msg.sender._id === user?._id || msg.sender.username === user?.username;
                  return (
                    <ChatMessageBubble
                      key={msg._id}
                      message={msg}
                      isOwn={isOwn}
                      onEdit={isOwn ? handleStartEdit : undefined}
                    />
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-xl border border-white/5 m-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 text-(--color-accent)">
                    <FiMessageSquare size={24} />
                  </div>
                  <p className="text-sm text-text-muted font-medium">Még nem írt senki üzenetet</p>
                  <p className="text-xs text-text-muted/60 mt-1">Légy te az első!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing indicator */}
            <AnimatePresence>
              {typingUser && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2 px-4 py-1.5 shrink-0 overflow-hidden"
                >
                  <div className="flex gap-1 bg-(--color-panel-header-bg) px-3 py-2 rounded-2xl rounded-bl-sm">
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-[10px] text-text-muted">{typingUser} gépel...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-3 bg-surface border-t border-(--color-border) shrink-0">
              {/* Edit mode banner */}
              <AnimatePresence>
                {editingMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between px-1 pb-2 text-[11px] text-(--color-accent) overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5">
                      <FiEdit2 size={11} />
                      <span>Üzenet szerkesztése</span>
                    </div>
                    <button
                      onClick={handleCancelEdit}
                      className="text-text-muted hover:text-white transition-colors p-0.5 rounded"
                      title="Mégsem"
                    >
                      <FiX size={12} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder={editingMessage ? "Szerkesztett üzenet..." : "Üzenet írása..."}
                  rows={1}
                  className="w-full bg-tertiary text-text-primary text-sm rounded-2xl py-2.5 pl-4 pr-11 focus:outline-none focus:ring-1 focus:ring-(--color-accent) border border-(--color-border) transition-all placeholder:text-text-muted resize-none max-h-[120px] scrollbar-hide flex items-center"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                    if (e.key === "Escape") {
                      handleCancelEdit();
                    }
                  }}
                />
                <button
                  className={`absolute right-1.5 bottom-1.5 p-2 rounded-full transition-all ${
                    message.trim()
                      ? "bg-(--color-accent) text-white hover:bg-accent-soft"
                      : "text-text-muted hover:text-white hover:bg-white/5"
                  }`}
                  disabled={!message.trim()}
                  onClick={handleSendMessage}
                  title="Küldés"
                >
                  <FiSend size={15} className="ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="w-14 h-14 bg-(--color-accent) hover:bg-accent-soft text-white rounded-full flex items-center justify-center shadow-lg shadow-black/30 transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-(--color-secondary) focus:ring-(--color-accent)"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              <FiX size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
            >
              <FiMessageSquare size={24} />

              {/* Unread badge - hide it if chat is open */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-(--color-secondary) text-[10px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatWidget;
