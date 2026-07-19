"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Heart, Link as LinkIcon, Share2, Search, Upload, User, X, TrendingUp, Shuffle, Volume2, Clock, Pause, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import PWAInstallButton from './components/PWAInstallButton';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import RealAudioUpload from './components/RealAudioUpload';
import ShareButtons from './components/ShareButtons';

interface Sound {
  id: number;
  name: string;
  slug: string;
  category: string;
  country: string;
  plays: number;
}

type CountryFilter = "All" | "US" | "IN";
type CategoryFilter = "All" | "Memes" | "Funny" | "Gaming";
type SortOption = "popular" | "newest";

export default function InstantSounds() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCountry, setActiveCountry] = useState<CountryFilter>("All");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [recentPlays, setRecentPlays] = useState<Sound[]>([]);
  const [volume, setVolume] = useState(0.6);

  // Load from localStorage on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem('volume');
    if (savedVolume) setVolume(parseFloat(savedVolume));

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

    const savedRecent = localStorage.getItem('recentPlays');
    if (savedRecent) setRecentPlays(JSON.parse(savedRecent));
  }, []);
  
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [showRealUploadModal, setShowRealUploadModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Memes");
  const [uploadCountry, setUploadCountry] = useState<"US" | "IN">("IN");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load sounds
  useEffect(() => {
    fetch('/data/sounds.json')
      .then(res => res.json())
      .then(data => {
        setSounds(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') playRandomSound();
      if (e.key.toLowerCase() === 'f') setShowFavoritesModal(true);
      if (e.key === 'Escape') {
        setShowUploadModal(false);
        setShowFavoritesModal(false);
        setShowRecentModal(false);
      }
      if (e.key === '?') toast.info("Shortcuts: R = Random | F = Favorites | Esc = Close");
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sounds]);

  const filteredSounds = useMemo(() => {
    return sounds
      .filter(sound => {
        const matchesSearch = sound.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                              sound.category.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesCountry = activeCountry === "All" || sound.country === activeCountry;
        const matchesCategory = activeCategory === "All" || sound.category === activeCategory;
        return matchesSearch && matchesCountry && matchesCategory;
      })
      .sort((a, b) => sortBy === "popular" ? b.plays - a.plays : b.id - a.id);
  }, [sounds, debouncedSearch, activeCountry, activeCategory, sortBy]);

  const favoriteSounds = sounds.filter(s => favorites.includes(s.id));

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayIntervalRef.current = setInterval(() => {
        if (filteredSounds.length > 0) {
          const randomIndex = Math.floor(Math.random() * filteredSounds.length);
          playSound(filteredSounds[randomIndex]);
        }
      }, 2200);
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    }
    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, [isAutoPlaying, filteredSounds]);

  const playSound = (sound: Sound) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.value = 180 + (sound.id % 12) * 35;
    osc2.frequency.value = osc1.frequency.value * 1.5;
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    gain.gain.value = volume;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    osc1.start();
    osc2.start();

    setPlayingId(sound.id);
    
    const duration = 900 + (sound.id % 4) * 150;
    setTimeout(() => {
      osc1.stop();
      osc2.stop();
      setPlayingId(null);
    }, duration);

    setSounds(prevSounds =>
      prevSounds.map(s =>
        s.id === sound.id ? { ...s, plays: s.plays + 1 } : s
      )
    );

    const newRecent = [sound, ...recentPlays.filter(s => s.id !== sound.id)].slice(0, 8);
    setRecentPlays(newRecent);
    localStorage.setItem('recentPlays', JSON.stringify(newRecent));

    toast.success(`Playing: ${sound.name}`);
  };

  const playRandomSound = () => {
    if (filteredSounds.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredSounds.length);
    playSound(filteredSounds[randomIndex]);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    if (!isAutoPlaying) {
      toast.success("Auto-play started 🎵");
    } else {
      toast.info("Auto-play stopped");
    }
  };

  const toggleFavorite = (id: number) => {
    const newFavorites = favorites.includes(id) 
      ? favorites.filter(f => f !== id) 
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    toast(favorites.includes(id) ? "Removed from favorites" : "Added to favorites ❤️");
  };

  const copyLink = (sound: Sound) => {
    navigator.clipboard.writeText(`https://instant.blazenxt.in/instant/${sound.slug}`);
    toast.success("Link copied!");
  };

  const shareSound = (sound: Sound) => {
    const url = `https://instant.blazenxt.in/instant/${sound.slug}`;
    if (navigator.share) {
      navigator.share({ title: sound.name, url });
    } else {
      copyLink(sound);
    }
  };

  const downloadSound = (sound: Sound) => {
    const blob = new Blob([""], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sound.name.replace(/[^a-z0-9]/gi, '_')}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloading: ${sound.name}`);
  };

  // Handle real audio upload
  const handleRealAudioUpload = (newSound: any) => {
    setSounds([newSound, ...sounds]);
    toast.success("Real audio uploaded!");
  };

  // Skeleton Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <nav className="border-b border-zinc-800 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-3 h-14 flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-zinc-800 rounded-xl animate-pulse" />
              <div className="w-32 h-6 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        </nav>
        
        <div className="max-w-7xl mx-auto px-3 pt-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="border border-zinc-800 bg-zinc-900 rounded-2xl p-3">
                <div className="h-20 bg-zinc-800 rounded-xl animate-pulse" />
                <div className="flex justify-between mt-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="w-8 h-8 bg-zinc-800 rounded-lg animate-pulse" />
                    ))}
                  </div>
                  <div className="w-10 h-4 bg-zinc-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-[#0a0a0a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="InstantSounds" className="w-9 h-9 rounded-xl" />
              <div>
                <span className="font-bold text-lg">InstantSounds</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <button onClick={toggleAutoPlay} className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${isAutoPlaying ? 'bg-green-600 text-white' : 'hover:bg-zinc-900'}`}>
              {isAutoPlaying ? <Pause size={15} /> : <Play size={15} />}
              <span className="hidden sm:inline">Auto</span>
            </button>
            
            <button onClick={playRandomSound} className="flex items-center gap-1 px-2 py-1.5 hover:bg-zinc-900 rounded-lg">
              <Shuffle size={15} />
              <span className="hidden sm:inline">Random</span>
            </button>
            
            <button onClick={() => setShowRecentModal(true)} className="flex items-center gap-1 px-2 py-1.5 hover:bg-zinc-900 rounded-lg">
              <Clock size={15} />
            </button>
            
            <button onClick={() => setShowFavoritesModal(true)} className="flex items-center gap-1 px-2 py-1.5 hover:bg-zinc-900 rounded-lg">
              <Heart size={15} />
              <span className="hidden sm:inline">Fav</span>
            </button>
            
            <button onClick={() => setShowRealUploadModal(true)} className="flex items-center gap-1 px-2 py-1.5 hover:bg-zinc-900 rounded-lg">
              <Upload size={15} />
            </button>
            
            <PWAInstallButton />
            
            <button onClick={() => toast.info("Login coming soon")} className="flex items-center gap-1 px-3 py-1.5 bg-white text-black rounded-lg text-sm font-medium">
              <User size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-6 text-center">
        <div className="inline px-3 py-1 text-xs bg-zinc-900 rounded-full mb-4">🔥 Trending worldwide</div>
        
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-3 leading-tight">
          The largest instant<br />sound buttons website
        </h1>
        <p className="text-zinc-400 text-base">Click to play. No download. No signup needed.</p>

        <div className="mt-5 flex items-center justify-center gap-3 text-sm">
          <Volume2 size={17} className="text-zinc-400" />
          <input type="range" min="0.1" max="1" step="0.05" value={volume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} className="w-36 accent-green-500" />
          <span className="text-xs text-zinc-500 w-8">{Math.round(volume * 100)}%</span>
        </div>

        <div className="mt-4 max-w-xs mx-auto relative">
          <Search className="absolute left-4 top-3 text-zinc-500" size={17} />
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search sounds..." 
            className="w-full bg-zinc-900 border border-zinc-800 pl-10 py-2.5 rounded-xl text-sm focus:outline-none focus:border-green-500" 
          />
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-4 border-b border-zinc-800 pb-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 bg-zinc-900 p-0.5 rounded-xl overflow-x-auto">
              {(["All", "US", "IN"] as const).map(c => (
                <button key={c} onClick={() => setActiveCountry(c)} className={`px-4 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap ${activeCountry === c ? 'bg-white text-black' : 'hover:bg-zinc-800'}`}>
                  {c === "All" ? "All" : c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-sm rounded-xl">
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
              </select>
              <div className="text-xs text-zinc-400 hidden sm:block">{filteredSounds.length} sounds</div>
            </div>
          </div>

          <div className="flex gap-1 bg-zinc-900 p-0.5 rounded-xl overflow-x-auto w-fit">
            {(["All", "Memes", "Funny", "Gaming"] as const).map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-white text-black font-medium' : 'hover:bg-zinc-800 text-zinc-300'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-5">
        <div className="flex items-center gap-2 mb-2 text-xs text-zinc-400">
          <TrendingUp size={15} /> Trending
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sounds.slice(0, 6).map(sound => (
            <button key={sound.id} onClick={() => playSound(sound)} className="text-xs whitespace-nowrap px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg">
              {sound.name.length > 18 ? sound.name.substring(0, 18) + "..." : sound.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sound Grid with Animations */}
      <div className="max-w-7xl mx-auto px-3 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          <AnimatePresence>
            {filteredSounds.map((sound, index) => {
              const isFav = favorites.includes(sound.id);
              const isPlaying = playingId === sound.id;

              return (
                <motion.div 
                  key={sound.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.015, 0.3) }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.985 }}
                  className={`sound-card border border-zinc-800 bg-zinc-900 rounded-2xl p-3 flex flex-col transition-all ${isPlaying ? 'ring-1 ring-green-500/50' : ''}`}
                >
                  <button 
                    onClick={() => playSound(sound)} 
                    className="flex-1 flex items-center gap-2.5 bg-zinc-950 active:bg-zinc-700 border border-zinc-800 px-3 py-3.5 rounded-xl text-left transition-colors relative overflow-hidden"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0 transition-all ${isPlaying ? 'scale-110' : ''}`}>
                      <Play size={16} className="text-black" fill="currentColor" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm leading-tight line-clamp-2">{sound.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{sound.category} • {sound.country}</div>
                    </div>
                    
                    {/* Playing indicator */}
                    {isPlaying && (
                      <div className="absolute right-2 top-2">
                        <div className="flex gap-0.5">
                          <div className="w-1 h-3 bg-green-400 animate-pulse rounded" />
                          <div className="w-1 h-3 bg-green-400 animate-pulse rounded delay-75" />
                          <div className="w-1 h-3 bg-green-400 animate-pulse rounded delay-150" />
                        </div>
                      </div>
                    )}
                  </button>

                  <div className="flex items-center justify-between mt-2 px-1">
                    <div className="flex gap-0.5">
                      <button onClick={() => toggleFavorite(sound.id)} className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors ${isFav ? 'text-red-500' : 'text-zinc-400'}`}>
                        <Heart size={15} fill={isFav ? "currentColor" : "none"} />
                      </button>
                      <button onClick={() => copyLink(sound)} className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors">
                        <LinkIcon size={15} />
                      </button>
                      <div className="relative group">
                        <button className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors">
                          <Share2 size={15} />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                          <ShareButtons 
                            url={`https://instant.blazenxt.in/instant/${sound.slug}`} 
                            title={sound.name} 
                          />
                        </div>
                      </div>
                      <button onClick={() => downloadSound(sound)} className="p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-green-400 rounded-lg transition-colors">
                        <Download size={15} />
                      </button>
                    </div>
                    
                    <a href={`/instant/${sound.slug}`} className="text-[10px] text-zinc-400 hover:text-white px-1.5 py-0.5 transition-colors">
                      View
                    </a>
                  </div>

                  <div className="text-[9px] text-zinc-500 text-right mt-0.5 pr-1">
                    {sound.plays.toLocaleString()} plays
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredSounds.length === 0 && (
          <div className="text-center py-12 text-zinc-400">No results found for "{debouncedSearch}"</div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-5 text-center text-xs text-zinc-500">
        Built on instant.blazenxt.in • Myinstants clone
      </footer>

      {/* Upload Modal with Animation */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl p-6 modal"
            >
              <div className="flex justify-between mb-5">
                <h3 className="font-semibold text-xl">Upload Sound</h3>
                <button onClick={() => setShowUploadModal(false)}><X /></button>
              </div>
              <input value={uploadName} onChange={e => setUploadName(e.target.value)} placeholder="Sound name" className="w-full bg-zinc-950 border border-zinc-700 px-4 py-3 rounded-xl mb-4" />
              <div className="grid grid-cols-2 gap-3 mb-6">
                <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} className="bg-zinc-950 border border-zinc-700 px-4 py-3 rounded-xl">
                  <option>Memes</option><option>Funny</option><option>Gaming</option>
                </select>
                <select value={uploadCountry} onChange={e => setUploadCountry(e.target.value as any)} className="bg-zinc-950 border border-zinc-700 px-4 py-3 rounded-xl">
                  <option value="IN">India</option><option value="US">US</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowUploadModal(false)} className="flex-1 py-3 border border-zinc-700 rounded-xl">Cancel</button>
                <button onClick={handleUpload} className="flex-1 py-3 bg-green-500 text-black font-medium rounded-xl">Upload</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Favorites Modal */}
      <AnimatePresence>
        {showFavoritesModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-2xl overflow-hidden modal"
            >
              <div className="p-5 border-b border-zinc-700 flex justify-between">
                <div className="font-semibold">Favorites ({favorites.length})</div>
                <button onClick={() => setShowFavoritesModal(false)}><X /></button>
              </div>
              <div className="max-h-[60vh] overflow-auto p-4">
                {favoriteSounds.length > 0 ? favoriteSounds.map(s => (
                  <div key={s.id} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-none">
                    <div className="pr-2 text-sm">{s.name}</div>
                    <div className="flex gap-3 flex-shrink-0">
                      <button onClick={() => playSound(s)} className="text-green-400"><Play size={16} /></button>
                      <button onClick={() => toggleFavorite(s.id)} className="text-red-400 text-sm">Remove</button>
                    </div>
                  </div>
                )) : <div className="py-8 text-center text-zinc-400">No favorites yet</div>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recent Modal */}
      <AnimatePresence>
        {showRecentModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-2xl overflow-hidden modal"
            >
              <div className="p-5 border-b border-zinc-700 flex justify-between">
                <div className="font-semibold">Recently Played</div>
                <button onClick={() => setShowRecentModal(false)}><X /></button>
              </div>
              <div className="max-h-[60vh] overflow-auto p-4">
                {recentPlays.length > 0 ? recentPlays.map(s => (
                  <div key={s.id} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-none">
                    <div>{s.name}</div>
                    <button onClick={() => playSound(s)} className="text-green-400"><Play size={16} /></button>
                  </div>
                )) : <div className="py-8 text-center text-zinc-400">No recent plays yet</div>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real Audio Upload Modal */}
      <RealAudioUpload 
        isOpen={showRealUploadModal} 
        onClose={() => setShowRealUploadModal(false)} 
        onUploadSuccess={handleRealAudioUpload} 
      />
    </div>
  );
}
