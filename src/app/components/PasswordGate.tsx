'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackClick } from '@/lib/analytics';
import { trackAuth } from './Tracker';


export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 쿠키에 auth_token이 있으면 인증된 상태
    const hasToken = document.cookie.split(';').some(c => c.trim().startsWith('auth_status='));
    if (hasToken) {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    trackClick('로그인');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
        setError(false);
        trackAuth();
        if (data.redirect) {
          router.push(data.redirect);
        }
      } else {
        setError(true);
        setInput('');
      }
    } catch {
      setError(true);
      setInput('');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return null;
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-blue-200 flex flex-col items-center justify-center px-4">
      <img
        src="/logo.png"
        alt="접속중 레기온"
        className="w-72 sm:w-80 object-contain drop-shadow-xl mb-6"
      />
      <div className="w-full max-w-sm">

        <form onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-xl">
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="비밀번호를 입력하세요"
            autoFocus
            className="w-full bg-white/60 border border-sky-200 text-zinc-800 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 placeholder-zinc-400 transition-all"
          />
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">비밀번호가 올바르지 않습니다.</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 shadow-md shadow-blue-500/30"
          >
            {loading ? '확인 중...' : '입장'}
          </button>
        </form>
      </div>
    </div>
  );
}
