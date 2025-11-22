
"use client";

import { useEffect, useState } from "react";
import { dataService } from "@/lib/dataService";
import Link from 'next/link';

interface Room {
  id: string;
  name: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      try {
        // Mock owner_id, this would come from the logged-in user session
        const newRoom = await dataService.createRoom(newRoomName, "mock_user_id");
        setRooms([...rooms, newRoom]);
        setNewRoomName("");
      } catch (error) {
        console.error("Failed to create room:", error);
      }
    }
  };

  if (loading) {
    return <p>Loading rooms...</p>;
  }

  return (
    <div>
      <h1>Public Rooms</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {/* The chat room page will be created in a later step */}
            <Link href={`/chat/${room.id}`}>{room.name}</Link>
          </li>
        ))}
      </ul>
      <hr />
      <h2>Create New Room</h2>
      <form onSubmit={handleCreateRoom}>
        <input
          type="text"
          placeholder="Room Name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
}
