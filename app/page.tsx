"use client";

import React, { useState } from 'react';
import { Play, Heart, Link as LinkIcon, Share2, Search, Upload, User } from 'lucide-react';
import { toast } from 'sonner';

// Sample sounds data (will be replaced with real data later)
const initialSounds = [
  { id: 1, name: "FAHHHHHHHHHHHHHH", slug: "fahhhhhhhhhhhhhh-3525", category: "Memes" },
  { id: 2, name: "VINE BOOM SOUND", slug: "vine-boom-sound-70972", category: "Memes" },
  { id: 3, name: "FAAAH", slug: "faaah-63455", category: "Memes" },
  { id: 4, name: "Fart", slug: "fart", category: "Funny" },
  { id: 5, name: "rizz sound effect", slug: "rizz-sound-effect-54189", category: "Memes" },
  { id: 6, name: "Among Us role reveal sound", slug: "among-us-role-reveal-sound-34956", category: "Gaming" },
  { id: 7, name: "BRUH", slug: "bruh", category: "Memes" },
  { id: 8, name: "Michael Jackson Hee Hee", slug: "michael-jackson-hee-hee-40277", category: "Memes" },
  { id: 9, name: "Metal pipe clang", slug: "metal-pipe-clang-80894", category: "Funny" },
  { id: 10, name: "Sad Violin (the meme one)", slug: "sad-violin-the-meme-one", category: "Memes" },
  { id: 11, name: "Taco Bell Bong", slug: "taco-bell-bong-42481", category: "Funny" },
  { id: 12, name: "Discord Notification", slug: "discord-notification-38119", category: "Gaming" },
  { id: 13, name: "SpongeBob Fail", slug: "spongebob-fail-11236", category: "Memes" },
  { id: 14, name: "Chicken on tree screaming", slug: "chicken-on-tree-screaming-53890", category: "Funny" },
  { id: 15, name: "YO PHONE IS RINGING", slug: "yo-phone-is-ringing-56694", category: "Memes" },
];

interface Sound {
  id: number;
  name: string;
  slug: string;
  category: string;
}

export default function InstantSounds() {
  const [sounds, setSounds] = useState<Sound[]>(initialSounds);
  const [searchTerm, setSearchTerm] = useState("");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Filter sounds based on search
  const filteredSounds = sounds.filter(sound =>
    sound.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sound.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Play sound (using Web Audio API with a placeholder tone for now)
  const playSound = (sound: Sound) => {
    // In a real app, this would play actual audio from Supabase
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 220 + (sound.id % 8) * 40;
    
    gainNode.gain.value = 0.3;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    setPlayingId(sound.id);
    
    // Stop after 1.2 seconds (simulating short meme sound)
    setTimeout(() => {
      oscillator.stop();
      setPlayingId(null);
    }, 1200);

    toast.success(`Playing: ${sound.name}`, {
      duration: 1200,
    });
  };

  // Toggle favorite
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Added to favorites ❤️");
    }
  };

  // Copy link
  const copyLink = (sound: Sound) => {
    const url = `https://instant.blazenxt.in/instant/${sound.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  // Share sound
  const shareSound = async (sound: Sound) => {
    const url = `https://instant.blazenxt.in/instant/${sound.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: sound.name,
          text: `Check out this sound: ${sound.name}`,
          url: url,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback to copy
      copyLink(sound);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="font-bold text-xl text-black">IS</span>
            </div>
            <div>
              <div className="font-semibold text-2xl tracking-tighter">InstantSounds</div>
              <div className="text-[10px] text-zinc-500 -mt-1">instant.blazenxt.in</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="#upload" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-colors"
            >
              <Upload size={16} /> Upload
            </a>
            
            <button 
              onClick={() => toast.info("Login feature coming soon!")}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-white text-black hover:bg-zinc-200 rounded-xl transition-colors"
            >
              <User size={16} /> Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-sm mb-6">
          🔥 <span className="text-green-400">Trending in India &amp; US</span>
        </div>
        
        <h1 className="text-6xl font-semibold tracking-tighter mb-4">
          The largest instant<br />sound buttons website
        </h1>
        <p className="text-xl text-zinc-400 max-w-md mx-auto">
          Play meme sounds instantly. No download. No sign up needed.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mt-8">
          <div className="absolute left-5 top-4 text-zinc-500">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search sounds (vine boom, bruh, fart...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input w-full pl-12 pr-5 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-lg focus:outline-none focus:border-green-500/50 placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-8 text-sm">
            <div>
              <span className="font-mono text-2xl font-semibold text-green-400">15,482</span>
              <span className="ml-2 text-zinc-400">sounds</span>
            </div>
            <div>
              <span className="font-mono text-2xl font-semibold text-green-400">2.4m</span>
              <span className="ml-2 text-zinc-400">plays today</span>
            </div>
          </div>
          
          <div className="text-sm text-zinc-400">
            Showing {filteredSounds.length} sounds
          </div>
        </div>
      </div>

      {/* Sound Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {filteredSounds.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            No sounds found for "{searchTerm}"
          </div>
        ) : (
          <div className="sound-grid">
            {filteredSounds.map((sound) => {
              const isFavorite = favorites.includes(sound.id);
              const isPlaying = playingId === sound.id;

              return (
                <div 
                  key={sound.id}
                  className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 flex flex-col"
                >
                  {/* Sound Name + Play Button */}
                  <button
                    onClick={() => playSound(sound)}
                    className="sound-button flex-1 flex items-center gap-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-2xl p-6 active:scale-[0.985] transition-all mb-4"
                  >
                    <div className="w-12 h-12 flex-shrink-0 bg-green-500 rounded-2xl flex items-center justify-center">
                      <Play 
                        size={22} 
                        className={`text-black ${isPlaying ? 'playing' : ''}`} 
                        fill="currentColor" 
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-semibold text-lg leading-tight pr-2">
                        {sound.name}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{sound.category}</div>
                    </div>
                  </button>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 justify-between px-1">
                    <button 
                      onClick={() => toggleFavorite(sound.id)}
                      className={`icon-btn flex items-center justify-center w-10 h-10 rounded-xl hover:bg-zinc-800 transition-colors ${isFavorite ? 'text-red-500' : 'text-zinc-400'}`}
                    >
                      <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </button>

                    <button 
                      onClick={() => copyLink(sound)}
                      className="icon-btn flex items-center justify-center w-10 h-10 rounded-xl text-zinc-400 hover:bg-zinc-800 transition-colors"
                    >
                      <LinkIcon size={18} />
                    </button>

                    <button 
                      onClick={() => shareSound(sound)}
                      className="icon-btn flex items-center justify-center w-10 h-10 rounded-xl text-zinc-400 hover:bg-zinc-800 transition-colors"
                    >
                      <Share2 size={18} />
                    </button>

                    <div className="flex-1" />

                    <div className="px-3 py-1 text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-500 rounded-full">
                      {sound.slug.split('-')[0]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-zinc-500">
          <p>Built with ❤️ on instant.blazenxt.in • Clone of Myinstants.com</p>
          <p className="mt-1">Instant playback • No signup required • Made for meme lovers</p>
        </div>
      </footer>
    </div>
  );
}
