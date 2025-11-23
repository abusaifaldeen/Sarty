
"use client";

import { useAuth } from '@/lib/AuthContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  // يمكننا إضافة اسم المرسل والصورة الرمزية هنا لاحقًا
  // sender_name: string;
  // sender_avatar: string;
}

interface MessageDisplayProps {
  messages: Message[];
}

export default function MessageDisplay({ messages }: MessageDisplayProps) {
  const { user } = useAuth();
  const currentUserId = user?.id;

  return (
    <div className="space-y-4">
      {messages.map((msg) => {
        const isCurrentUser = msg.sender_id === currentUserId;
        return (
          <div
            key={msg.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                isCurrentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {/* سنقوم بعرض اسم المرسل هنا عندما يكون متاحًا */}
              {!isCurrentUser && (
                <p className="text-sm font-bold">{msg.sender_id}</p>
              )}
              <p>{msg.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
