
"use client";

import HeaderBanner from './components/HeaderBanner';
import NavigationTabs from './components/NavigationTabs';
import LoginArea from './components/LoginArea';
import OnlineUsersList from './components/OnlineUsersList';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <HeaderBanner />
      <NavigationTabs />

      <main className="container mx-auto px-4 py-8">
        <LoginArea />
        <OnlineUsersList />
      </main>

      <Footer />
    </div>
  );
}
