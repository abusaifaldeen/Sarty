
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import MessageDisplay from "@/app/components/MessageDisplay";
import MessageInput from "@/app/components/MessageInput";
import Toolbar from "@/app/components/Toolbar";
import SidePanel from "@/app/components/SidePanel";
import VisitorsPanel from "@/app/components/VisitorsPanel";
import RoomsPanel from "@/app/components/RoomsPanel";
import Header from "@/app/components/Header";
import { dataService } from "@/lib/dataService";
import styles from './ChatRoom.module.css';

let socket;

interface Message {
  id: string;
  content: string;
  sender_id: string;
}

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelContent, setSidePanelContent] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDataAndInitSocket() {
      if (roomId) {
        try {
          // Fetch initial data
          const [initialMessages, onlineUsers] = await Promise.all([
            dataService.getMessages(roomId),
            dataService.getOnlineUsers(),
          ]);
          setMessages(initialMessages);
          setVisitorCount(onlineUsers.length);

          // Initialize Socket.IO
          await fetch("/api/socket");
          socket = io({ path: "/api/socket_io" });

          socket.on("connect", () => {
            console.log("Connected to socket server");
            socket.emit("join-room", roomId);
          });

          socket.on("new-message", (message: string) => {
            const newMessage: Message = {
              id: `msg-${Date.now()}`,
              content: message,
              sender_id: "some_user",
            };
            setMessages((prev) => [...prev, newMessage]);
          });

        } catch (error) {
          console.error("Failed to fetch initial data or init socket:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchDataAndInitSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [roomId]);

  const handleSendMessage = (message: string) => {
    if (message && roomId) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content: message,
        sender_id: "me",
      };
      setMessages((prev) => [...prev, newMessage]);
      socket.emit("send-message", { roomId, message });
    }
  };

  const handleToolbarClick = (content: string) => {
    setSidePanelContent(content);
    setSidePanelOpen(true);
  };

  const renderSidePanelContent = () => {
    switch (sidePanelContent) {
      case "Visitors":
        return <VisitorsPanel />;
      case "Rooms":
        return <RoomsPanel />;
      default:
        return <h2>{sidePanelContent}</h2>;
    }
  };

  if (loading) return <p>Loading chat...</p>;

  return (
    <div className={styles.chatContainer}>
      <Header />
      <div className={styles.mainContent}>
        <div className={styles.messageDisplayWrapper}>
           <MessageDisplay messages={messages} />
        </div>
      </div>

      <div className={styles.bottomBar}>
        <Toolbar onButtonClick={handleToolbarClick} visitorCount={visitorCount} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>

      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
      >
        {renderSidePanelContent()}
      </SidePanel>
    </div>
  );
}
