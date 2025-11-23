
"use client";

import React, { useEffect, useState } from 'react';
import UserCard from './UserCard';
import { dataService } from '../../lib/dataService';
import { User } from '@/lib/types'; // استيراد النوع المركزي

const OnlineUsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const onlineUsers = await dataService.getOnlineUsers();
        setUsers(onlineUsers as User[]);
      } catch (err) {
        setError('فشل تحميل قائمة المستخدمين المتصلين.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="mt-8">
      {/* رأس القائمة */}
      <div className="mb-4 flex items-center justify-between rounded-t-lg bg-white p-2 shadow-sm">
        <div className="flex items-center">
          <span className="ml-2 rounded-md bg-green-500 px-3 py-1 text-sm font-semibold text-white">
            متصل
          </span>
        </div>
        <div className="flex items-center text-green-600">
          <span className="font-bold">{users.length}</span>
          <svg className="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
             <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
             <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* قائمة بطاقات المستخدمين */}
      <div className="space-y-2">
        {loading && <p className="text-center text-gray-500">جاري تحميل المستخدمين...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && users.length === 0 && (
          <p className="text-center text-gray-500">لا يوجد مستخدمون متصلون حاليًا.</p>
        )}
        {users.map((user) => (
          <UserCard key={user.id} user={{
              ...user,
              avatar_url: user.avatar_url || 'https://via.placeholder.com/60',
              custom_status: user.custom_status || ''
          }} />
        ))}
      </div>
    </section>
  );
};

export default OnlineUsersList;
