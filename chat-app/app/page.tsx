"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io({
        path: "/api/socket_io",
      });

      socket.on("connect", () => {
        console.log("connected");
      });

      // This is a placeholder for receiving messages
      // We will implement this properly in the next step
      socket.on("new-message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message) {
      socket.emit("send-message", message);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
