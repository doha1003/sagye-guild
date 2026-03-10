'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackClick } from '@/lib/analytics';


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
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="접속중 레기온"
            className="w-40 h-40 object-contain rounded-2xl shadow-lg shadow-amber-500/20 mb-4"
          />
          <h1 className="text-2xl font-bold text-amber-400">접속중 레기온</h1>
          <p className="text-zinc-500 text-xs mt-1">AION2 지켈 서버</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-800/80 backdrop-blur border border-zinc-700/50 rounded-2xl p-6 shadow-xl">
          <input
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            placeholder="비밀번호를 입력하세요"
            autoFocus
            className="w-full bg-zinc-900/80 border border-zinc-600 text-white rounded-xl px-4 py-3 mb-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 placeholder-zinc-600 transition-all"
          />
          {error && (
            <p className="text-red-400 text-sm mb-3">비밀번호가 올바르지 않습니다.</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-900 font-bold py-3 rounded-xl transition-all disabled:opacity-50 shadow-md shadow-amber-500/25"
          >
            {loading ? '확인 중...' : '입장'}
          </button>
        </form>
      </div>
    </div>
  );
}
