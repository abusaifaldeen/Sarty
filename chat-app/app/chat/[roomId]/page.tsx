
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/lib/SocketContext"; // استخدام السياق الجديد
import MessageDisplay from "@/app/components/MessageDisplay";
// ... (بقية الاستيرادات)
import { Message } from "@/lib/types";

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { user } = useAuth();
  const { socket, isConnected } = useSocket(); // الحصول على السوكيت من السياق

  const [messages, setMessages] = useState<Message[]>([]);
  // ... (بقية الحالات)

  useEffect(() => {
    async function fetchInitialData() {
      if (roomId && user) {
        try {
          const initialMessages = await dataService.getMessages(roomId);
          setMessages(initialMessages as Message[]);
        } catch (error) {
          console.error("فشل في جلب البيانات الأولية:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchInitialData();
  }, [roomId, user]);

  useEffect(() => {
    if (socket) {
      // الانضمام للغرفة عند توفر السوكيت
      socket.emit("join-room", roomId);

      // تعريف المستمعين
      const handleNewMessage = (data: { message: string, sender_id: string }) => {
        // ... (إضافة رسالة جديدة)
      };
      const handleMessageDeleted = (data: { messageId: number }) => {
        // ... (حذف رسالة)
      };
      const handleReconnect = () => {
        window.location.reload();
      };

      socket.on("new-message", handleNewMessage);
      socket.on("message-deleted", handleMessageDeleted);
      socket.on('reconnect-now', handleReconnect);

      // إزالة المستمعين عند تفكيك المكون
      return () => {
        socket.off("new-message", handleNewMessage);
        socket.off("message-deleted", handleMessageDeleted);
        socket.off('reconnect-now', handleReconnect);
      };
    }
  }, [socket, roomId]);

  // ... (بقية الكود)
}
