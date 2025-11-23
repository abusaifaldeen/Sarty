
"use client";

import { useEffect, useState } from "react";
import { dataService } from "@/lib/dataService";
import { useAuth } from "@/lib/AuthContext";
import { PrivateMessage } from "@/lib/types"; // استيراد النوع المركزي

export default function PrivateMessagesPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      async function fetchMessages() {
        try {
          const privateMessages = await dataService.getPrivateMessages(user.id);
          setMessages(privateMessages as PrivateMessage[]);
        } catch (error) {
          console.error("فشل جلب الرسائل الخاصة:", error);
          setError("لم نتمكن من تحميل الرسائل الخاصة.");
        } finally {
          setLoading(false);
        }
      }
      fetchMessages();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">الرسائل الخاصة</h2>
      {loading && <p>جاري تحميل الرسائل...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!user && <p>يجب تسجيل الدخول لعرض الرسائل الخاصة.</p>}

      <ul className="space-y-3">
        {!loading && user && messages.map((pm) => (
          <li key={pm.id} className="rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <strong className="font-semibold">{pm.sender_id}</strong> {/* سنستبدل هذا باسم المرسل لاحقًا */}
              <small className="text-gray-500">
                {new Date(pm.created_at).toLocaleTimeString('ar-SA')}
              </small>
            </div>
            <p className="mt-1 text-gray-700">{pm.content}</p>
            {!pm.read_status && (
              <div className="mt-2 text-right text-xs font-bold text-red-500">
                رسالة جديدة
              </div>
            )}
          </li>
        ))}
         {!loading && user && messages.length === 0 && (
            <p className="text-center text-gray-500">لا يوجد رسائل خاصة لعرضها.</p>
        )}
      </ul>
    </div>
  );
}
