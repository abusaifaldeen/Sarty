
"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useSocket } from '@/lib/SocketContext'; // استيراد useSocket
import { dataService } from '@/lib/dataService';

// ... (بقية الكود)

export default function AdminPage() {
  const { user } = useAuth();
  const { socket } = useSocket(); // الحصول على السوكيت من السياق
  // ... (بقية الحالات)

  // ... (دالة التحقق من الصلاحيات)

  // ... (دالة handleClearRoom)

  const handleBackup = async () => {
    // ... (الكود كما هو)
  };

  const handleForceReconnect = () => {
    if (socket && window.confirm('هل أنت متأكد أنك تريد إجبار جميع المستخدمين على إعادة الاتصال؟')) {
      socket.emit('force-reconnect');
      setMessage('تم إرسال أمر إعادة الاتصال.');
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-4">
      {/* ... (العنوان الرئيسي وقسم حذف الرسائل) */}

      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        {/* ... (قسم النسخ الاحتياطي) */}
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">إجراءات عامة</h2>
        <button
          onClick={handleForceReconnect}
          className="w-full rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          disabled={!socket?.connected} // تعطيل الزر إذا لم يكن السوكيت متصلاً
        >
          إجبار جميع المستخدمين على إعادة الاتصال
        </button>
      </div>
    </div>
  );
}
