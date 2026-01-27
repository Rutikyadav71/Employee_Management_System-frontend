import React, { useEffect, useRef, useState } from "react";
import { connect, disconnect } from "../services/chatService";
import { FaChevronLeft, FaChevronRight, FaComments } from "react-icons/fa";
import ChatSidebar from "./ChatSidebar";
import ChatRoom from "./ChatRoom";
import "./chat.css";

function ChatPage() {
  const role = localStorage.getItem("role");

  const rawId =
    role === "ADMIN"
      ? localStorage.getItem("id")
      : localStorage.getItem("empId");

  const currentUserId = Number(rawId);

  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!currentUserId || Number.isNaN(currentUserId) || !role) {
      console.error("❌ Missing chat identity", { currentUserId, role });
      return;
    }

    connect(currentUserId, role, (msg) => {
      setIncomingMessage(msg);
      setRefreshTrigger((prev) => prev + 1);
    });

    return () => disconnect();
  }, [currentUserId, role]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIncomingMessage(null);
    setRefreshTrigger((prev) => prev + 1);

    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handler = () => setSidebarOpen((prev) => !prev);
    window.addEventListener("chat-toggle-sidebar", handler);
    return () => window.removeEventListener("chat-toggle-sidebar", handler);
  }, []);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const delta = touchEndX.current - touchStartX.current;

    if (delta > 80) setSidebarOpen(true);
    if (delta < -80) setSidebarOpen(false);
  };

  return (
    <div
      className="chat-page-wrapper"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="chat-topbar">
        <button
          className="chat-toggle-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
        <span className="chat-title"> <FaComments className="me-2" />Chat Room</span>
      </div>

      <div className="chat-container">
        <div
          className={`chat-sidebar-wrapper ${
            sidebarOpen ? "open" : "closed"
          }`}
        >
          <ChatSidebar
            currentUserId={currentUserId}
            currentUserRole={role}
            onSelectUser={handleSelectUser}
            selectedUser={selectedUser}
            refreshTrigger={refreshTrigger}
          />
        </div>

        <div className="chat-room-wrapper">
          <ChatRoom
            key={`${selectedUser?.id || "empty"}_${selectedUser?.role || ""}`}
            currentUserId={currentUserId}
            currentUserRole={role}
            selectedUser={selectedUser}
            incomingMessage={incomingMessage}
            onMessageSent={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
