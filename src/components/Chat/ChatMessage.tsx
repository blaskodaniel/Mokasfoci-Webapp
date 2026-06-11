import { format } from "date-fns";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import type { ChatMessage } from "@/models/chat.type";
import { ChatMessageType } from "@/utils/enums";
import Avatar from "@/components/Avatar";

const ChatMessageBubble = ({
  message,
  isOwn = false,
  onEdit,
}: {
  message: ChatMessage;
  isOwn?: boolean;
  onEdit?: (msg: ChatMessage) => void;
}) => {
  const time = format(new Date(message.createdAt), "HH:mm");
  const [hovered, setHovered] = useState(false);

  if (message.type === ChatMessageType.system) {
    return (
      <div className="flex flex-col items-center justify-center w-full my-3 gap-1">
        <div className="flex items-center gap-2 mb-1.5">
          <img
            src="/spori_icon.jpeg"
            alt="Spori"
            className="w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          />
          <span className="text-[10px] font-bold text-purple-300 tracking-wider">Spori</span>
        </div>
        <div className="text-sm py-2.5 px-4 rounded-2xl shadow-sm text-center bg-indigo-500/10 border border-indigo-500/30 text-indigo-100 max-w-[90%] backdrop-blur-sm">
          {message.message}
        </div>
        <span className="text-[9px] text-text-muted px-1">{time}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} gap-1`}>
      {!isOwn && (
        <span className="text-[10px] text-text-muted ml-10 font-medium">
          {message.sender?.name || message.sender?.username || "Ismeretlen"}
        </span>
      )}

      <div
        className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {!isOwn && (
          <Avatar
            avatar={message.sender?.avatar || ""}
            size={8}
            className="mb-4 border border-white/10 shadow-sm rounded-full"
          />
        )}

        <div className="flex flex-col gap-0.5">
          <div className={`flex items-center gap-1.5 ${isOwn ? "flex-row-reverse" : ""}`}>
            <div
              className={`text-white text-sm py-2 px-3.5 rounded-2xl shadow-sm relative ${
                isOwn ? "bg-button-bg rounded-br-sm" : "bg-(--color-panel-header-bg) rounded-bl-sm"
              }`}
            >
              {message.message}
            </div>

            {/* Edit button - only for own messages on hover */}
            {isOwn && onEdit && hovered && (
              <button
                onClick={() => onEdit(message)}
                className="text-text-muted hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 shrink-0"
                title="Szerkesztés"
              >
                <FiEdit2 size={12} />
              </button>
            )}
          </div>

          <span className={`text-[9px] text-text-muted px-1 ${isOwn ? "text-right" : "text-left"}`}>
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
