
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Home.module.css';

export default function HomePage() {
  const [entryMode, setEntryMode] = useState<'guest' | 'member' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // For now, we'll just store the guest name in localStorage and redirect
      // A more robust solution would involve a guest session on the backend
      localStorage.setItem('guestName', username);
      router.push('/rooms');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* Banner can be controlled from admin panel later */}
        <h1>Welcome to Our Chat Community</h1>
      </header>

      <div className={styles.marquee}>
        <span>A friendly welcome message to all visitors.</span>
      </div>

      <main className={styles.main}>
        <div className={styles.loginOptions}>
          <button onClick={() => setEntryMode('guest')}>Enter as a Guest</button>
          <button onClick={() => setEntryMode('member')}>Member Login</button>
          <Link href="/signup">
            <button>Register Membership</button>
          </Link>
        </div>

        {entryMode === 'guest' && (
          <form onSubmit={handleGuestLogin} className={styles.loginForm}>
            <input
              type="text"
              placeholder="Enter a temporary name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button type="submit">Enter Chat</button>
          </form>
        )}

        {entryMode === 'member' && (
          // This will redirect to the actual login page to handle credentials securely
          // We can replace this with a direct form later if we handle state properly
          <div className={styles.memberRedirect}>
             <p>Please proceed to the member login page.</p>
             <Link href="/login"><button>Go to Login</button></Link>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Chat App. All rights reserved.</p>
        <div className={styles.socialLinks}>
          {/* Add social media links here */}
        </div>
      </footer>
    </div>
  );
}
