
"use client";

interface Message {
  id: string;
  content: string;
  sender_id: string;
}

interface MessageDisplayProps {
  messages: Message[];
}

export default function MessageDisplay({ messages }: MessageDisplayProps) {
  return (
    <div style={{ padding: '10px', overflowY: 'auto', height: '100%' }}>
      {messages.map((msg) => (
        <p key={msg.id}>
          <strong>{msg.sender_id}:</strong> {msg.content}
        </p>
      ))}
    </div>
  );
}
