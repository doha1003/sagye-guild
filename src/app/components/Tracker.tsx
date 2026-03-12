'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId() {
  let id = sessionStorage.getItem('track_sid');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('track_sid', id);
  }
  return id;
}

function send(event: { type: string; page: string; duration?: number; referrer?: string }) {
  const sessionId = getSessionId();
  const body = JSON.stringify({
    sessionId,
    event: { ...event, timestamp: Date.now() },
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/tracking', body);
  } else {
    fetch('/api/tracking', { method: 'POST', body, keepalive: true });
  }
}

export function trackAuth() {
  send({ type: 'auth', page: window.location.pathname });
}

export default function Tracker() {
  const pathname = usePathname();
  const enterTime = useRef(Date.now());
  const lastPage = useRef('');

  const sendLeave = useCallback(() => {
    if (lastPage.current) {
      const duration = Math.round((Date.now() - enterTime.current) / 1000);
      send({ type: 'leave', page: lastPage.current, duration });
    }
  }, []);

  useEffect(() => {
    // 이전 페이지 leave 이벤트
    sendLeave();

    // 새 페이지 pageview 이벤트
    enterTime.current = Date.now();
    lastPage.current = pathname;
    send({
      type: 'pageview',
      page: pathname,
      referrer: document.referrer || undefined,
    });
  }, [pathname, sendLeave]);

  useEffect(() => {
    const handleUnload = () => sendLeave();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sendLeave]);

  return null;
}
