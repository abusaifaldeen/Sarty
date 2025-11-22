
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { dataService } from "@/lib/dataService";
import io from "socket.io-client";

let socket;

interface Message {
  id: string;
  content: string;
  sender_id: string;
}

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial messages
    async function fetchMessages() {
      if (roomId) {
        try {
          const initialMessages = await dataService.getMessages(roomId);
          setMessages(initialMessages);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchMessages();

    // Initialize Socket.IO
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io({ path: "/api/socket_io" });

      socket.on("connect", () => {
        console.log("Connected to socket server");
        // Join the specific room
        socket.emit("join-room", roomId);
      });

      socket.on("new-message", (message: string) => {
        // Create a new message object to update the state
        // In a real app, you'd get sender info from the payload or a user context
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          content: message,
          sender_id: "some_user", // Placeholder sender ID
        };
        setMessages((prev) => [...prev, newMessage]);
      });
    };
    socketInitializer();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message && roomId) {
      // Update the UI locally immediately
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content: message,
        sender_id: "me", // Placeholder for the current user
      };
      setMessages((prev) => [...prev, newMessage]);

      // Send the message to the server
      socket.emit("send-message", { roomId, message });

      // Clear the input
      setMessage("");
    }
  };

  if (loading) {
    return <p>Loading chat...</p>;
  }

  return (
    <div>
      <h1>Chat Room: {roomId}</h1>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}><strong>{msg.sender_id}:</strong> {msg.content}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
