
import React from 'react';
import { User } from '@/lib/types'; // استيراد النوع المركزي

const UserCard = ({ user }: { user: User }) => {
  return (
    <div className="relative mb-2 flex w-full items-center rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      {/* يمكن إضافة شريط لوني هنا بناءً على الرتبة أو الحالة */}
      {/* <div className="absolute top-0 left-0 h-1 w-full rounded-t-lg bg-green-500"></div> */}

      {/* الصورة الرمزية */}
      <div className="relative ml-4">
        <img
          src={user.avatar_url || '/default-avatar.png'} // استخدام صورة بديلة
          alt={`الصورة الرمزية لـ ${user.name}`}
          className="h-16 w-16 rounded-md object-cover"
        />
        {/* يمكن إضافة إطار زخرفي هنا بناءً على رتبة المستخدم */}
      </div>

      {/* معلومات المستخدم */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold">{user.name}</h3>
        {/* النجوم */}
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < user.stars ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
        {/* رسالة الحالة */}
        <p className="text-sm text-gray-500">{user.custom_status}</p>
      </div>

      {/* علم الدولة */}
      <div className="mr-4">
        {user.country_flag && (
          <img
            src={`/flags/${user.country_flag}.svg`} // نفترض أن الأعلام موجودة في public/flags
            alt="علم الدولة"
            className="h-6 w-6"
          />
        )}
      </div>
    </div>
  );
};

export default UserCard;
