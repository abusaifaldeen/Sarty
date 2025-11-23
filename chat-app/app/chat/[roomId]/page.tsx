
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import MessageDisplay from "@/app/components/MessageDisplay";
import MessageInput from "@/app/components/MessageInput";
import Toolbar from "@/app/components/Toolbar";
import SidePanel from "@/app/components/SidePanel";
import VisitorsPanel from "@/app/components/VisitorsPanel";
import RoomsPanel from "@/app/components/RoomsPanel";
import PrivateMessagesPanel from "@/app/components/PrivateMessagesPanel";
import Header from "@/app/components/Header";
import { dataService } from "@/lib/dataService";
import { useAuth } from "@/lib/AuthContext";
import { Message } from "@/lib/types"; // استيراد النوع المركزي

let socket: Socket;

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { user, session } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelContent, setSidePanelContent] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDataAndInitSocket() {
      if (roomId && user && session) {
        try {
          const [initialMessages, onlineUsers] = await Promise.all([
            dataService.getMessages(roomId),
            dataService.getOnlineUsers(),
          ]);
          setMessages(initialMessages as Message[]);
          setVisitorCount(onlineUsers.length);

          await fetch("/api/socket");

          socket = io({
            path: "/api/socket_io",
            auth: {
              token: session.access_token
            }
          });

          socket.on("connect", () => {
            console.log("تم الاتصال وتأكيد الهوية بنجاح.");
            setSocketError(null);
            socket.emit("join-room", roomId);
          });

          socket.on('connect_error', (err) => {
            console.error("خطأ في الاتصال:", err.message);
            setSocketError("فشل التحقق من الهوية. لا يمكن الاتصال بالدردشة.");
          });

          socket.on("new-message", (data: { message: string, sender_id: string }) => {
            const newMessage: Message = {
              id: `msg-${Date.now()}`,
              content: data.message,
              sender_id: data.sender_id,
              room_id: roomId, // إضافة room_id
              created_at: new Date().toISOString() // إضافة الطابع الزمني
            };
            setMessages((prev) => [...prev, newMessage]);
          });

        } catch (error) {
          console.error("فشل في جلب البيانات الأولية:", error);
        } finally {
          setLoading(false);
        }
      } else if (!session) {
          setLoading(false);
          setSocketError("يجب تسجيل الدخول للوصول إلى الدردشة.");
      }
    }
    fetchDataAndInitSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [roomId, user, session]);

  const handleSendMessage = (message: string) => {
    if (message && roomId && user && socket && socket.connected) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content: message,
        sender_id: user.id,
        room_id: roomId,
        created_at: new Date().toISOString()
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
      case "Private":
        return <PrivateMessagesPanel />;
      default:
        return <h2>{sidePanelContent}</h2>;
    }
  };

  if (loading) return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">جاري تحميل الدردشة...</p>
      </div>
  );

  if (socketError) return (
      <div className="flex h-screen items-center justify-center p-4">
        <p className="text-lg text-red-500">{socketError}</p>
      </div>
  );

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="bg-gray-100 p-2 text-center">
        <p>أهلاً بك، {user?.email || "زائر"}!</p>
      </div>
      <main className="flex-grow overflow-y-auto bg-gray-50 p-4">
        <MessageDisplay messages={messages} />
      </main>
      <footer className="bg-white p-2 shadow-inner">
        <Toolbar onButtonClick={handleToolbarClick} visitorCount={visitorCount} />
        <MessageInput onSendMessage={handleSendMessage} />
      </footer>
      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
      >
        {renderSidePanelContent()}
      </SidePanel>
    </div>
  );
}
