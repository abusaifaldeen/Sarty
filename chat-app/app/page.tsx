
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Chat App</h1>
      <p>
        <Link href="/rooms">Browse Public Rooms</Link>
      </p>
      <p>
        <Link href="/login">Login</Link> or <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
