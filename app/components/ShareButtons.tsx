"use client";

import React from 'react';
import { Share2, Twitter, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (e) {}
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={shareToTwitter}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        title="Share on Twitter"
      >
        <Twitter size={16} />
      </button>
      <button 
        onClick={shareToWhatsApp}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        title="Share on WhatsApp"
      >
        <MessageCircle size={16} />
      </button>
      <button 
        onClick={shareNative}
        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        title="Share"
      >
        <Share2 size={16} />
      </button>
    </div>
  );
}
