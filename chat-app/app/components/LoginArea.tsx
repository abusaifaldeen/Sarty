
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/authService';

type LoginMode = 'guest' | 'member' | 'register';

const LoginArea = () => {
  const [loginMode, setLoginMode] = useState<LoginMode>('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authService.signUp({ email, password, options: { data: { name: username } } });
      // You might want to show a "check your email" message
      // For now, we'll just redirect to the login page
      setLoginMode('member');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authService.signIn({ email, password });
      router.push('/rooms'); // Redirect to chat rooms on successful login
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('guestName', username);
      router.push('/rooms');
    }
  };


  const renderForm = () => {
    switch (loginMode) {
      case 'guest':
        return (
          <form onSubmit={handleGuestLogin}>
            <input
              type="text"
              placeholder="أكتب الاسم المستعار"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 text-center"
              required
            />
            <button type="submit" className="mt-4 w-full rounded-md bg-gray-200 p-3 font-semibold text-gray-700 hover:bg-gray-300">
              دخول
            </button>
          </form>
        );
      case 'member':
        return (
          <form onSubmit={handleSignIn}>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 text-center mb-2"
              required
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 text-center"
              required
            />
            <button type="submit" className="mt-4 w-full rounded-md bg-gray-200 p-3 font-semibold text-gray-700 hover:bg-gray-300">
              دخول الأعضاء
            </button>
          </form>
        );
      case 'register':
        return (
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder="اختر اسم مستعار"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 text-center mb-2"
              required
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 text-center mb-2"
              required
            />
            <input
              type="password"
              placeholder="اختر كلمة مرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-3 text-center"
              required
            />
            <button type="submit" className="mt-4 w-full rounded-md bg-blue-500 p-3 font-semibold text-white hover:bg-blue-600">
              تسجيل عضوية
            </button>
          </form>
        );
    }
  };

  return (
    <section className="my-4 rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Login Options Bar */}
      <div className="flex justify-around border-b border-gray-200">
         <button
          onClick={() => setLoginMode('register')}
          className={`flex-1 p-3 font-semibold ${loginMode === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          👤 تسجيل عضوية
        </button>
        <button
          onClick={() => setLoginMode('member')}
          className={`flex-1 p-3 font-semibold ${loginMode === 'member' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          👤 دخول الأعضاء
        </button>
        <button
          onClick={() => setLoginMode('guest')}
          className={`flex-1 p-3 font-semibold ${loginMode === 'guest' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          👤 دخول الزوار
        </button>
      </div>

      {/* Login Form Area */}
      <div className="p-6">
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        {renderForm()}
      </div>
    </section>
  );
};

export default LoginArea;
