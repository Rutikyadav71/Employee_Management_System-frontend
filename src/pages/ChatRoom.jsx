import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { sendMessage } from "../services/chatService";
import { FaSmile, FaTrash, FaCheckDouble } from "react-icons/fa";
import "./chat.css";

const EMOJI_CATEGORIES = {
  Smileys: ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😍","😘","😜","🤔","😎","😭","😡","👍","🙏","🔥","💯"],
  Animals: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵"],
  Food: ["🍎","🍌","🍇","🍕","🍔","🍟","🌭","🍿","🍩","🍪","🍰","🎂","☕","🍺"],
  Symbols: ["❤️","💔","✨","🎉","🎯","⚡","💡","🚀","🏆","🎁","📌","📎"]
};

function ChatRoom({
  currentUserId,
  currentUserRole,
  selectedUser,
  incomingMessage,
  onMessageSent,
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeTab, setActiveTab] = useState("Smileys");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;

    axios.get("http://localhost:8080/api/chat/history", {
      params: {
        id1: currentUserId,
        role1: currentUserRole,
        id2: selectedUser.id,
        role2: selectedUser.role,
      },
    }).then((res) => setMessages(res.data || []));

    axios.put("http://localhost:8080/api/chat/read", null, {
      params: {
        senderId: selectedUser.id,
        senderRole: selectedUser.role,
        receiverId: currentUserId,
        receiverRole: currentUserRole,
      },
    });
  }, [selectedUser, currentUserId, currentUserRole]);

  useEffect(() => {
    if (!incomingMessage || !selectedUser) return;

    const isSameChat =
      (incomingMessage.senderId === selectedUser.id &&
        incomingMessage.senderRole === selectedUser.role) ||
      (incomingMessage.receiverId === selectedUser.id &&
        incomingMessage.receiverRole === selectedUser.role);

    if (isSameChat) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  }, [incomingMessage, selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !selectedUser) return;

    const msg = {
      senderId: currentUserId,
      senderRole: currentUserRole,
      receiverId: selectedUser.id,
      receiverRole: selectedUser.role,
      message: text.trim(),
    };

    sendMessage(msg);

    setMessages((prev) => [
      ...prev,
      { ...msg, timestamp: new Date().toISOString(), status: "SENT" },
    ]);

    setText("");
    setShowEmoji(false);
    onMessageSent?.();
  };

  const deleteMessage = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  if (!selectedUser) {
    return (
      <div className="chat-room-empty">
        <h5>Select a user to start chatting</h5>
      </div>
    );
  }

  return (
    <div className="chat-room">
      <div className="chat-header">
        <strong>{selectedUser.name}</strong>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => {
          const isMe =
            m.senderId === currentUserId &&
            m.senderRole === currentUserRole;

          const time = m.timestamp
            ? new Date(m.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div key={i} className={`message-row ${isMe ? "right" : "left"}`}>
              <div className={`message-bubble ${isMe ? "sent" : "received"}`}>
                <div className="message-text">{m.message}</div>

                <div className="message-meta">
                  <span className="time">{time}</span>

                  {isMe && <FaCheckDouble className="ticks" />}
                  {isMe && (
                    <FaTrash
                      className="delete-icon"
                      onClick={() => deleteMessage(i)}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <button
          className="emoji-btn"
          onClick={() => setShowEmoji((p) => !p)}
        >
          <FaSmile />
        </button>

        {showEmoji && (
          <div className="emoji-box">
            <div className="emoji-tabs">
              {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                <span
                  key={cat}
                  className={`emoji-tab ${
                    activeTab === cat ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="emoji-grid">
              {EMOJI_CATEGORIES[activeTab].map((e, i) => (
                <span
                  key={i}
                  className="emoji-item"
                  onClick={() => setText((prev) => prev + e)}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}

        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button className="btn btn-primary ms-2" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
