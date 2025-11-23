
"use client";

import { useEffect, useState } from "react";
import { dataService } from "@/lib/dataService";
import UserCard from "./UserCard";
import { User } from "@/lib/types"; // استيراد النوع المركزي

export default function VisitorsPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const onlineUsers = await dataService.getOnlineUsers();
        setUsers(onlineUsers as User[]);
      } catch (error) {
        console.error("فشل جلب المستخدمين:", error);
        setError("لم نتمكن من تحميل قائمة الزوار.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">الزوار ({users.length})</h2>
      {loading && <p>جاري تحميل الزوار...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        {!loading && users.map((user) => (
          <UserCard key={user.id} user={{
            ...user,
            avatar_url: user.avatar_url || 'https://via.placeholder.com/60',
            custom_status: user.custom_status || 'متصل'
          }} />
        ))}
      </div>
    </div>
  );
}
