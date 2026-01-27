import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./chat.css";

function ChatSidebar({
  currentUserId,
  currentUserRole,
  onSelectUser,
  selectedUser,
  refreshTrigger,
}) {
  const [users, setUsers] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});
  const [lastMsgMap, setLastMsgMap] = useState({});
  const [search, setSearch] = useState("");

  // Load all chat users
  useEffect(() => {
    axios.get("http://localhost:8080/api/chat-users").then((res) => {
      let allUsers = res.data || [];

      allUsers = allUsers.filter(
        (u) =>
          !(
            Number(u.id) === Number(currentUserId) &&
            u.role === currentUserRole
          )
      );

      setUsers(allUsers);
    });
  }, [currentUserId, currentUserRole]);

  useEffect(() => {
    users.forEach((u) => {
      const key = `${u.id}_${u.role}`;

      axios
        .get("http://localhost:8080/api/chat/unread", {
          params: {
            senderId: u.id,
            senderRole: u.role,
            receiverId: currentUserId,
            receiverRole: currentUserRole,
          },
        })
        .then((res) => {
          setUnreadMap((prev) => ({ ...prev, [key]: res.data }));
        });

      axios
        .get("http://localhost:8080/api/chat/history", {
          params: {
            id1: currentUserId,
            role1: currentUserRole,
            id2: u.id,
            role2: u.role,
          },
        })
        .then((res) => {
          const last = res.data?.[res.data.length - 1];
          if (last) {
            setLastMsgMap((prev) => ({ ...prev, [key]: last }));
          }
        });
    });
  }, [users, currentUserId, currentUserRole, refreshTrigger]);

  const sortedUsers = useMemo(() => {
    return users
      .filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const ka = `${a.id}_${a.role}`;
        const kb = `${b.id}_${b.role}`;
        const ta = lastMsgMap[ka]?.timestamp || 0;
        const tb = lastMsgMap[kb]?.timestamp || 0;
        return new Date(tb) - new Date(ta);
      });
  }, [users, lastMsgMap, search]);

  const admins = sortedUsers.filter((u) => u.role === "ADMIN");
  const employees = sortedUsers.filter((u) => u.role === "USER");

  const renderUser = (u) => {
    const key = `${u.id}_${u.role}`;
    const isActive =
      selectedUser &&
      selectedUser.id === u.id &&
      selectedUser.role === u.role;

    const lastMsg = lastMsgMap[key]?.message || "No messages yet";
    const lastTime = lastMsgMap[key]?.timestamp
      ? new Date(lastMsgMap[key].timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <div
        key={key}
        className={`chat-user ${isActive ? "active" : ""}`}
        onClick={() => onSelectUser(u)}
      >
        <div className="chat-user-info">
          <strong>{u.name}</strong>
          <div className="chat-user-preview">{lastMsg}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          {lastTime && <div className="chat-user-time">{lastTime}</div>}
          {unreadMap[key] > 0 && (
            <span className="chat-unread-badge">
              {unreadMap[key]}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <strong>Chats</strong>
      </div>

      <div className="chat-search-box">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="chat-user-list">
        {admins.length > 0 && (
          <>
            <div className="px-3 py-2 text-muted small">ADMINS</div>
            {admins.map(renderUser)}
          </>
        )}

        {employees.length > 0 && (
          <>
            <div className="px-3 py-2 text-muted small">EMPLOYEES</div>
            {employees.map(renderUser)}
          </>
        )}
      </div>
    </div>
  );
}

export default ChatSidebar;
