"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Heart, Link as LinkIcon, Share2, ArrowLeft, User } from 'lucide-react';
import { toast } from 'sonner';

// Same sounds data (in real app this would come from database)
const allSounds = [
  { id: 1, name: "FAHHHHHHHHHHHHHH", slug: "fahhhhhhhhhhhhhh-3525", category: "Memes", country: "US" },
  { id: 2, name: "VINE BOOM SOUND", slug: "vine-boom-sound-70972", category: "Memes", country: "US" },
  { id: 3, name: "FAAAH", slug: "faaah-63455", category: "Memes", country: "US" },
  { id: 4, name: "BRUH", slug: "bruh", category: "Memes", country: "US" },
  { id: 5, name: "rizz sound effect", slug: "rizz-sound-effect-54189", category: "Memes", country: "US" },
  { id: 6, name: "Among Us role reveal sound", slug: "among-us-role-reveal-sound-34956", category: "Gaming", country: "US" },
  { id: 7, name: "Michael Jackson Hee Hee", slug: "michael-jackson-hee-hee-40277", category: "Memes", country: "US" },
  { id: 8, name: "Metal pipe clang", slug: "metal-pipe-clang-80894", category: "Funny", country: "US" },
  { id: 9, name: "Sad Violin (the meme one)", slug: "sad-violin-the-meme-one", category: "Memes", country: "US" },
  { id: 10, name: "Taco Bell Bong", slug: "taco-bell-bong-42481", category: "Funny", country: "US" },
  { id: 11, name: "Fart", slug: "fart", category: "Funny", country: "IN" },
  { id: 12, name: "Discord Notification", slug: "discord-notification-38119", category: "Gaming", country: "IN" },
  { id: 13, name: "SpongeBob Fail", slug: "spongebob-fail-11236", category: "Memes", country: "IN" },
  { id: 14, name: "Chicken on tree screaming", slug: "chicken-on-tree-screaming-53890", category: "Funny", country: "IN" },
  { id: 15, name: "YO PHONE IS RINGING", slug: "yo-phone-is-ringing-56694", category: "Memes", country: "IN" },
  { id: 16, name: "Du bist gut genug", slug: "du-bist-gut-genug-22336", category: "Memes", country: "IN" },
  { id: 17, name: "Error SOUNDSS", slug: "error-soundss-25534", category: "Funny", country: "IN" },
  { id: 18, name: "Long brain fart", slug: "long-brain-fart-60967", category: "Funny", country: "IN" },
  { id: 19, name: "Punch Sound", slug: "punch-sound-86161", category: "Funny", country: "IN" },
  { id: 20, name: "spiderman meme song", slug: "spiderman-meme-song-37638", category: "Memes", country: "IN" },
  { id: 21, name: "Dexter meme", slug: "dexter-meme-26140", category: "Memes", country: "US" },
  { id: 22, name: "What a good boy", slug: "what-a-good-boy-58925", category: "Funny", country: "US" },
  { id: 23, name: "ACK", slug: "ack-87763", category: "Memes", country: "US" },
  { id: 24, name: "Gay, gay, gay, gay…", slug: "gay-gay-gay-gay-81081", category: "Memes", country: "US" },
  { id: 25, name: "dun dun dunnnnnnnn", slug: "dun-dun-dunnnnnnnn-68584", category: "Memes", country: "US" },
  { id: 26, name: "The Undertaker Bell", slug: "the-undertaker-bell-30938", category: "Memes", country: "IN" },
  { id: 27, name: "ding sound effect", slug: "ding-sound-effect", category: "Funny", country: "IN" },
  { id: 28, name: "romanceeeeeeeeeeeeee", slug: "romanceeeeeeeeeeeeee-29042", category: "Memes", country: "IN" },
  { id: 29, name: "Bone Crack", slug: "bone-crack-23901", category: "Funny", country: "US" },
  { id: 30, name: "Anime Wow", slug: "anime-wow", category: "Memes", country: "IN" },
];

export default function SoundDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const sound = allSounds.find(s => s.slug === slug);
  const [playing, setPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(Math.floor(Math.random() * 120000) + 45000);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!sound) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Sound not found</h1>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white text-black rounded-2xl"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const playSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator1.type = 'sawtooth';
    oscillator2.type = 'square';
    
    const baseFreq = 180 + (sound.id % 12) * 35;
    oscillator1.frequency.value = baseFreq;
    oscillator2.frequency.value = baseFreq * 1.5;

    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    gainNode.gain.value = 0.3;

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator1.start();
    oscillator2.start();

    setPlaying(true);

    const duration = 1100 + (sound.id % 4) * 180;

    setTimeout(() => {
      oscillator1.stop();
      oscillator2.stop();
      setPlaying(false);
      setPlayCount(prev => prev + 1);
    }, duration);

    toast.success(`Playing ${sound.name}`);
  };

  const copyLink = () => {
    const url = `https://instant.blazenxt.in/instant/${sound.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const shareSound = async () => {
    const url = `https://instant.blazenxt.in/instant/${sound.slug}`;
    if (navigator.share) {
      await navigator.share({ title: sound.name, url });
    } else {
      copyLink();
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites ❤️");
  };

  // Related sounds (same category or country)
  const relatedSounds = allSounds
    .filter(s => s.id !== sound.id && (s.category === sound.category || s.country === sound.country))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')} 
            className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors"
          >
            <ArrowLeft size={18} /> Back to InstantSounds
          </button>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            instant.blazenxt.in
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-12 pb-20">
        {/* Main Sound Card */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 md:p-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-mono text-zinc-400">
                  {sound.country}
                </span>
                <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">
                  {sound.category}
                </span>
              </div>
              <h1 className="text-5xl font-semibold tracking-tighter leading-none">
                {sound.name}
              </h1>
            </div>
            
            <button 
              onClick={toggleFavorite}
              className={`p-3 rounded-2xl transition-all ${isFavorite ? 'text-red-500 bg-zinc-800' : 'text-zinc-400 hover:bg-zinc-800'}`}
            >
              <Heart size={26} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Big Play Button */}
          <button
            onClick={playSound}
            disabled={playing}
            className="w-full flex items-center justify-center gap-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-black text-2xl font-semibold py-8 rounded-3xl transition-all disabled:opacity-75"
          >
            <Play size={36} className={playing ? "animate-pulse" : ""} fill="currentColor" />
            {playing ? "PLAYING..." : "PLAY SOUND"}
          </button>

          {/* Stats */}
          <div className="flex justify-between mt-8 text-sm text-zinc-400">
            <div>
              <span className="font-mono text-xl text-white font-semibold">{playCount.toLocaleString()}</span> plays
            </div>
            <div>
              {Math.floor(Math.random() * 12000) + 3000} favorites
            </div>
            <div>
              Uploaded 2 days ago
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button 
              onClick={copyLink}
              className="flex-1 flex items-center justify-center gap-2 py-4 border border-zinc-700 hover:bg-zinc-800 rounded-2xl font-medium"
            >
              <LinkIcon size={18} /> Copy Link
            </button>
            <button 
              onClick={shareSound}
              className="flex-1 flex items-center justify-center gap-2 py-4 border border-zinc-700 hover:bg-zinc-800 rounded-2xl font-medium"
            >
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>

        {/* Related Sounds */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-xl">Related Sounds</h3>
            <button onClick={() => router.push('/')} className="text-sm text-green-400 hover:underline">
              Browse all →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedSounds.map((related) => (
              <button
                key={related.id}
                onClick={() => router.push(`/instant/${related.slug}`)}
                className="flex items-center gap-4 p-5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-left transition-all"
              >
                <div className="w-11 h-11 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Play size={20} className="text-black" fill="currentColor" />
                </div>
                <div>
                  <div className="font-medium">{related.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{related.category} • {related.country}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
