
"use client";

// Mock data for private messages
const mockPrivateMessages = [
  { id: 1, sender: "Alice", message: "Hey, how are you?", time: "10:30 AM", unread: 2 },
  { id: 2, sender: "Bob", message: "Meeting at 2 PM.", time: "11:15 AM", unread: 0 },
  { id: 3, sender: "Charlie", message: "Can you check the report?", time: "1:00 PM", unread: 1 },
];

export default function PrivateMessagesPanel() {
  return (
    <div>
      <h2>Private Messages</h2>
      <ul>
        {mockPrivateMessages.map((pm) => (
          <li key={pm.id} style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{pm.sender}</strong>
              <small>{pm.time}</small>
            </div>
            <p>{pm.message}</p>
            {pm.unread > 0 && <span style={{ color: 'red' }}>{pm.unread} new messages</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
