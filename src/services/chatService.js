import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;
let isConnected = false;
let pendingMessages = [];

export function connect(userId, role, onMessage) {
  console.log("Connecting WS as:", userId, role);

  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 3000,
    debug: (str) => console.log("STOMP:", str),

    onConnect: () => {
      console.log("WebSocket connected");
      isConnected = true;

      const userQueue = `/user/${role}_${userId}/queue/messages`;
      console.log("Subscribing:", userQueue);

      stompClient.subscribe(userQueue, (msg) => {
        const body = JSON.parse(msg.body);
        console.log("Incoming WS:", body);
        onMessage(body);
      });

      const queued = [...pendingMessages];
      pendingMessages = [];

      queued.forEach((m) => {
        stompClient.publish({
          destination: "/app/chat.send",
          body: JSON.stringify(m)
        });
      });
    },

    onWebSocketClose: () => {
      console.warn("WebSocket closed");
      isConnected = false;
    }
  });

  stompClient.activate();
}

export function sendMessage(msg) {
  if (stompClient && isConnected) {
    console.log("Sending WS:", msg);

    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(msg)
    });
  } else {
    console.warn("WebSocket not connected yet — queued");
    pendingMessages.push(msg);
  }
}

export function disconnect() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
    pendingMessages = [];
    console.log("WebSocket disconnected");
  }
}
