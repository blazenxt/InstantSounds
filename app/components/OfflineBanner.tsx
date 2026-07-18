"use client";

import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-14 left-0 right-0 bg-orange-600 text-white py-2 z-[60]">
      <div className="flex items-center justify-center gap-2 text-sm">
        <WifiOff size={16} />
        <span>You're offline. Some features may be limited.</span>
      </div>
    </div>
  );
}
