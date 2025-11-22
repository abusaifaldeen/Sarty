
"use client";

import { useEffect, useState } from "react";
import { dataService } from "@/lib/dataService";
import { useRouter } from "next/navigation";
import styles from './RoomsPanel.module.css';

interface Room {
  id: string;
  name: string;
}

export default function RoomsPanel() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const publicRooms = await dataService.getPublicRooms();
        setRooms(publicRooms);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  const handleRoomClick = (roomId: string) => {
    router.push(`/chat/${roomId}`);
  };

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div>
      <h2>Rooms</h2>
      <ul className={styles.roomList}>
        {rooms.map((room) => (
          <li key={room.id} onClick={() => handleRoomClick(room.id)} className={styles.roomItem}>
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
