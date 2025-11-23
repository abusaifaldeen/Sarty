
"use client";

import { useEffect, useState } from "react";
import { dataService } from "@/lib/dataService";
import Link from 'next/link';
import { useAuth } from "@/lib/AuthContext";

// يجب أن يتطابق هذا النوع مع بنية جدول 'rooms'
interface Room {
  id: string;
  name: string;
}

export default function RoomsPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const publicRooms = await dataService.getPublicRooms();
        setRooms(publicRooms);
      } catch (error) {
        console.error("فشل جلب الغرف:", error);
        setError("لم نتمكن من تحميل الغرف المتاحة.");
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() && user) {
      try {
        const newRoom = await dataService.createRoom(newRoomName, user.id);
        setRooms([...rooms, newRoom]);
        setNewRoomName("");
      } catch (error) {
        console.error("فشل إنشاء الغرفة:", error);
        setError("حدث خطأ أثناء إنشاء الغرفة. يرجى المحاولة مرة أخرى.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">جاري تحميل الغرف...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">الغرف العامة</h1>

      {error && <p className="mb-4 text-center text-red-500">{error}</p>}

      <ul className="mb-8 space-y-2">
        {rooms.map((room) => (
          <li key={room.id} className="rounded-lg bg-white p-4 shadow transition hover:bg-gray-50">
            <Link href={`/chat/${room.id}`} className="block text-lg font-semibold text-blue-600 hover:underline">
              {room.name}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="my-8" />

      <h2 className="mb-4 text-2xl font-bold">إنشاء غرفة جديدة</h2>
      <form onSubmit={handleCreateRoom} className="flex space-x-2">
        <input
          type="text"
          placeholder="اسم الغرفة"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          className="flex-grow rounded-md border border-gray-300 p-2"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          disabled={!newRoomName.trim() || !user}
        >
          إنشاء
        </button>
      </form>
    </div>
  );
}
