
"use client";

import { useEffect, useState } from "react";
import { dataService } from "@/lib/dataService";
import styles from './VisitorsPanel.module.css';

interface User {
  id: string;
  name: string;
  avatar: string;
  country: string;
  status: string;
}

export default function VisitorsPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const onlineUsers = await dataService.getOnlineUsers();
        setUsers(onlineUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p>Loading visitors...</p>;

  return (
    <div>
      <h2>Visitors ({users.length})</h2>
      <ul className={styles.visitorList}>
        {users.map((user) => (
          <li key={user.id} className={styles.visitorItem}>
            <span className={styles.avatar}>{user.avatar}</span>
            <div>
              <span>{user.name} {user.country}</span>
              <br />
              <small className={user.status === 'Online' ? styles.statusOnline : styles.statusAway}>
                {user.status}
              </small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
