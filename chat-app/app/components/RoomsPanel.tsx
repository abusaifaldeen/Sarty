
"use client";

import { useEffect, useState } from "react";
import { dataService } from "@/lib/dataService";
import Link from 'next/link';
import { Room } from "@/lib/types"; // استيراد النوع المركزي

export default function RoomsPanel() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const publicRooms = await dataService.getPublicRooms();
        setRooms(publicRooms as Room[]);
      } catch (error) {
        console.error("فشل جلب الغرف:", error);
        setError("لم نتمكن من تحميل قائمة الغرف.");
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">الغرف المتاحة</h2>
      {loading && <p>جاري تحميل الغرف...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {!loading && rooms.map((room) => (
          <li key={room.id}>
            <Link
              href={`/chat/${room.id}`}
              className="block rounded-lg bg-gray-100 p-3 font-semibold text-gray-800 transition hover:bg-blue-100"
            >
              {room.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
