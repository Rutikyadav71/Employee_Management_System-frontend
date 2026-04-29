import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;
let isConnected = false;
let pendingMessages = [];

export function connect(userId, role, onMessage) {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS("https://employee-management-system-backend-wc0p.onrender.com/ws"),
    reconnectDelay: 3000,

    onConnect: () => {
      isConnected = true;
      // Subscribe to this user's personal queue
      // Key pattern: {ROLE}_{userId}  e.g. "ADMIN_1" or "USER_101"
      const userQueue = `/user/${role}_${userId}/queue/messages`;
      stompClient.subscribe(userQueue, (frame) => {
        try {
          const body = JSON.parse(frame.body);
          onMessage(body);
        } catch (e) { console.error("WS parse error", e); }
      });

      // Flush any queued messages
      const queued = [...pendingMessages];
      pendingMessages = [];
      queued.forEach(m => stompClient.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(m),
      }));
    },

    onWebSocketClose: () => { isConnected = false; },
    onStompError: () => { isConnected = false; },
  });

  stompClient.activate();
}

/**
 * msg shape expected by ChatMessage entity:
 *   senderId, senderRole, receiverId, receiverRole, message
 * Note: field is "message" (not "content")!
 */
export function sendMessage(msg) {
  if (stompClient && isConnected) {
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(msg),
    });
  } else {
    pendingMessages.push(msg);
  }
}

export function disconnect() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
    pendingMessages = [];
  }
}
