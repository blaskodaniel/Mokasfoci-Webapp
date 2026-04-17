import { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiEdit2, FiArrowDown } from "react-icons/fi";
import ChatMessageBubble from "./ChatMessage";
import type { ChatMessage } from "@/models/chat.type";
import { useChatMessages } from "@/hooks/api/useChat";
import { useSocket } from "@/hooks/useSocket";
import { useSocketContext } from "@/context/SocketContext";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [message, setMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const prevScrollHeightRef = useRef<number>(0);
  const isLoadingOlderRef = useRef(false);
  const justOpenedRef = useRef(false);

  const queryClient = useQueryClient();
  const socket = useSocket();
  const { authError } = useSocketContext();
  const { user } = useAuth();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      justOpenedRef.current = true;
    }
  };

  const isNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleContainerScroll = () => {
    if (isNearBottom()) {
      setHasNewMessage(false);
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessages("general", 50);

  const messages = useMemo(() => {
    return data?.pages ? [...data.pages].reverse().flatMap((page) => page) : [];
  }, [data]);

  // WebSocket figyelés az új üzenetekre
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (newMessage: ChatMessage) => {
      console.log("receive_message", newMessage);
      queryClient.setQueryData(
        ["chat", "general"],
        (oldData: InfiniteData<ChatMessage[]> | undefined) => {
          if (!oldData) return { pages: [[newMessage]], pageParams: [undefined] };

          const newPages = [...oldData.pages];
          newPages[0] = [...newPages[0], newMessage];

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    socket.on("message_updated", (updatedMessage: ChatMessage) => {
      queryClient.setQueryData(
        ["chat", "general"],
        (oldData: InfiniteData<ChatMessage[]> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
            ),
          };
        }
      );
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

  const newestMessageId = messages?.[messages.length - 1]?._id;

  useEffect(() => {
    if (isOpen) {
      if (justOpenedRef.current) {
        scrollToBottom("instant");
        if (newestMessageId) {
          justOpenedRef.current = false;
        }
      } else if (isNearBottom()) {
        scrollToBottom();
      } else {
        setHasNewMessage(true);
      }
    }
  }, [isOpen, newestMessageId]);

  // Scroll pozíció megőrzése régebbi üzenetek betöltése után
  useLayoutEffect(() => {
    if (isLoadingOlderRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight - prevScrollHeightRef.current;
      isLoadingOlderRef.current = false;
    }
  }, [messages]);

  const handleLoadOlder = () => {
    const container = messagesContainerRef.current;
    if (container) {
      prevScrollHeightRef.current = container.scrollHeight;
      isLoadingOlderRef.current = true;
    }
    fetchNextPage();
  };

  const handleTyping = useMemo(() => {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
      if (!socket) return;
      socket.emit("typing_start", "general");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        socket.emit("typing_stop", "general");
      }, 1000); // 1mp tétlenség után leáll
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
            <div
              ref={messagesContainerRef}
              onScroll={handleContainerScroll}
              className="relative flex-1 p-4 overflow-y-auto bg-panel-bg flex flex-col gap-4 min-h-0 scrollbar-hide"
            >
              {authError ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3 text-red-400">
                    <FiX size={22} />
                  </div>
                  <p className="text-sm text-red-400 font-medium">A munkamenet lejárt</p>
                  <p className="text-xs text-text-muted mt-1">
                    Kérjük jelentkezz be újra a chat használatához.
                  </p>
                </div>
              ) : messages && messages.length > 0 ? (
                <>
                  {hasNextPage && (
                    <div className="flex justify-center shrink-0 mb-2">
                      <button
                        onClick={handleLoadOlder}
                        disabled={isFetchingNextPage}
                        className="text-[11px] text-white hover:text-yellow-300 bg-white/10 px-4 py-1.5 rounded-full cursor-pointer disabled:opacity-50 transition-colors"
                      >
                        {isFetchingNextPage ? "Betöltés..." : "Korábbi üzenetek betöltése"}
                      </button>
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isOwn =
                      msg.sender?._id === user?._id || msg.sender?.username === user?.username;
                    return (
                      <ChatMessageBubble
                        key={msg._id}
                        message={msg}
                        isOwn={isOwn}
                        onEdit={isOwn ? handleStartEdit : undefined}
                      />
                    );
                  })}
                </>
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

              {/* Új üzenet jelző */}
              <AnimatePresence>
                {hasNewMessage && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => {
                      scrollToBottom();
                      setHasNewMessage(false);
                    }}
                    className="sticky bottom-2 self-center flex items-center gap-1.5 bg-(--color-accent) text-white text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-accent-soft transition-colors"
                  >
                    <FiArrowDown size={12} />
                    Új üzenet
                  </motion.button>
                )}
              </AnimatePresence>
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
                  disabled={authError}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder={
                    authError
                      ? "Munkamenet lejárt – jelentkezz be újra"
                      : editingMessage
                        ? "Szerkesztett üzenet..."
                        : "Üzenet írása..."
                  }
                  rows={1}
                  className={`w-full bg-tertiary text-text-primary text-sm rounded-2xl py-2.5 pl-4 pr-11 focus:outline-none focus:ring-1 focus:ring-(--color-accent) border border-(--color-border) transition-all placeholder:text-text-muted resize-none max-h-[120px] scrollbar-hide flex items-center ${authError ? "opacity-50 cursor-not-allowed" : ""}`}
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
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="w-14 h-14 bg-(--color-accent) hover:bg-accent-soft text-white rounded-full flex items-center justify-center shadow-lg shadow-black/30 transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-(--color-secondary) focus:ring-(--color-accent)"
          >
            <FiMessageSquare size={24} />

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-(--color-secondary) text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
