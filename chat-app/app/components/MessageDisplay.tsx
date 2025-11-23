
"use client";

import { useAuth } from '@/lib/AuthContext';
import { Message, User } from '@/lib/types';
import { Socket } from 'socket.io-client';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useEffect, useRef } from 'react';

interface MessageDisplayProps {
  messages: Message[];
  socket: Socket | null;
  roomId: string;
}

const canDelete = (user: User | null): boolean => {
  if (!user || !user.role) return false;
  return ['Admin', 'Super Admin'].includes(user.role);
};

// تعريف مكون الرسالة الذي سيتم عرضه داخل القائمة الافتراضية
const MessageRow = ({ index, style, data }: { index: number; style: React.CSSProperties; data: any }) => {
  const { messages, user, currentUserId, handleDelete } = data;
  const msg = messages[index];
  const isCurrentUser = msg.sender_id === currentUserId;

  return (
    <div style={style}>
      <div
        id={`message-${msg.id}`}
        className={`group flex items-center gap-2 py-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        {canDelete(user) && (
          <button
            onClick={() => handleDelete(Number(msg.id))}
            className="hidden text-red-500 opacity-50 transition hover:opacity-100 group-hover:block"
            title="حذف الرسالة"
          >
            🗑️
          </button>
        )}
        <div
          className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
            isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          {!isCurrentUser && (
            <p className="text-sm font-bold">{msg.sender_id}</p>
          )}
          <p className="break-words">{msg.content}</p>
        </div>
      </div>
    </div>
  );
};

export default function MessageDisplay({ messages, socket, roomId }: MessageDisplayProps) {
  const { user } = useAuth();
  const listRef = useRef<List>(null);

  // التمرير إلى آخر رسالة عند وصول رسالة جديدة
  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages.length]);

  const handleDelete = (messageId: number) => {
    if (socket && canDelete(user)) {
      socket.emit('delete-public-message', { messageId, roomId });
    }
  };

  return (
    <div className="h-full w-full">
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            itemCount={messages.length}
            itemSize={70} // تقدير متوسط ارتفاع الرسالة، يمكن تعديله
            width={width}
            itemData={{
              messages,
              user,
              currentUserId: user?.id,
              handleDelete,
            }}
          >
            {MessageRow}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}
