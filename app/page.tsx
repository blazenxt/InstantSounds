"use client";

import React, { useState } from 'react';
import { Play, Heart, Link as LinkIcon, Share2, Search, Upload, User, X, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const allSounds = [
  { id: 1, name: "FAHHHHHHHHHHHHHH", slug: "fahhhhhhhhhhhhhh-3525", category: "Memes", country: "US", plays: 124000 },
  { id: 2, name: "VINE BOOM SOUND", slug: "vine-boom-sound-70972", category: "Memes", country: "US", plays: 289000 },
  { id: 3, name: "FAAAH", slug: "faaah-63455", category: "Memes", country: "US", plays: 97000 },
  { id: 4, name: "BRUH", slug: "bruh", category: "Memes", country: "US", plays: 312000 },
  { id: 5, name: "rizz sound effect", slug: "rizz-sound-effect-54189", category: "Memes", country: "US", plays: 145000 },
  { id: 6, name: "Among Us role reveal sound", slug: "among-us-role-reveal-sound-34956", category: "Gaming", country: "US", plays: 89000 },
  { id: 7, name: "Michael Jackson Hee Hee", slug: "michael-jackson-hee-hee-40277", category: "Memes", country: "US", plays: 76000 },
  { id: 8, name: "Metal pipe clang", slug: "metal-pipe-clang-80894", category: "Funny", country: "US", plays: 213000 },
  { id: 9, name: "Sad Violin (the meme one)", slug: "sad-violin-the-meme-one", category: "Memes", country: "US", plays: 178000 },
  { id: 10, name: "Taco Bell Bong", slug: "taco-bell-bong-42481", category: "Funny", country: "US", plays: 134000 },
  { id: 11, name: "Fart", slug: "fart", category: "Funny", country: "IN", plays: 267000 },
  { id: 12, name: "Discord Notification", slug: "discord-notification-38119", category: "Gaming", country: "IN", plays: 98000 },
  { id: 13, name: "SpongeBob Fail", slug: "spongebob-fail-11236", category: "Memes", country: "IN", plays: 165000 },
  { id: 14, name: "Chicken on tree screaming", slug: "chicken-on-tree-screaming-53890", category: "Funny", country: "IN", plays: 82000 },
  { id: 15, name: "YO PHONE IS RINGING", slug: "yo-phone-is-ringing-56694", category: "Memes", country: "IN", plays: 194000 },
  { id: 16, name: "Du bist gut genug", slug: "du-bist-gut-genug-22336", category: "Memes", country: "IN", plays: 73000 },
  { id: 17, name: "Error SOUNDSS", slug: "error-soundss-25534", category: "Funny", country: "IN", plays: 112000 },
  { id: 18, name: "Long brain fart", slug: "long-brain-fart-60967", category: "Funny", country: "IN", plays: 67000 },
  { id: 19, name: "Punch Sound", slug: "punch-sound-86161", category: "Funny", country: "IN", plays: 54000 },
  { id: 20, name: "spiderman meme song", slug: "spiderman-meme-song-37638", category: "Memes", country: "IN", plays: 158000 },
  { id: 21, name: "Dexter meme", slug: "dexter-meme-26140", category: "Memes", country: "US", plays: 92000 },
  { id: 22, name: "What a good boy", slug: "what-a-good-boy-58925", category: "Funny", country: "US", plays: 78000 },
  { id: 23, name: "ACK", slug: "ack-87763", category: "Memes", country: "US", plays: 61000 },
  { id: 24, name: "Gay, gay, gay, gay…", slug: "gay-gay-gay-gay-81081", category: "Memes", country: "US", plays: 143000 },
  { id: 25, name: "dun dun dunnnnnnnn", slug: "dun-dun-dunnnnnnnn-68584", category: "Memes", country: "US", plays: 87000 },
  { id: 26, name: "The Undertaker Bell", slug: "the-undertaker-bell-30938", category: "Memes", country: "IN", plays: 119000 },
  { id: 27, name: "ding sound effect", slug: "ding-sound-effect", category: "Funny", country: "IN", plays: 45000 },
  { id: 28, name: "romanceeeeeeeeeeeeee", slug: "romanceeeeeeeeeeeeee-29042", category: "Memes", country: "IN", plays: 104000 },
  { id: 29, name: "Bone Crack", slug: "bone-crack-23901", category: "Funny", country: "US", plays: 59000 },
  { id: 30, name: "Anime Wow", slug: "anime-wow", category: "Memes", country: "IN", plays: 127000 },
];

interface Sound {
  id: number;
  name: string;
  slug: string;
  category: string;
  country: string;
  plays: number;
}

type CountryFilter = "All" | "US" | "IN";
type SortOption = "popular" | "newest";

export default function InstantSounds() {
  const [sounds, setSounds] = useState<Sound[]>(allSounds);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCountry, setActiveCountry] = useState<CountryFilter>("All");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Memes");
  const [uploadCountry, setUploadCountry] = useState<"US" | "IN">("IN");

  const filteredSounds = sounds
    .filter(sound => {
      const matchesSearch = sound.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            sound.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = activeCountry === "All" || sound.country === activeCountry;
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => sortBy === "popular" ? b.plays - a.plays : b.id - a.id);

  const favoriteSounds = sounds.filter(s => favorites.includes(s.id));

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
    gain.gain.value = 0.25;

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

    toast.success(`Playing: ${sound.name}`);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(favorites.includes(id) 
      ? favorites.filter(f => f !== id) 
      : [...favorites, id]);
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

  const handleUpload = () => {
    if (!uploadName.trim()) return toast.error("Enter a name");
    
    const newSound: Sound = {
      id: Date.now(),
      name: uploadName.trim(),
      slug: uploadName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      category: uploadCategory,
      country: uploadCountry,
      plays: 0,
    };
    
    setSounds([newSound, ...sounds]);
    setUploadName("");
    setShowUploadModal(false);
    toast.success("Sound uploaded!");
    setTimeout(() => playSound(newSound), 500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar - Classic Myinstants style */}
      <nav className="border-b border-zinc-800 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <span className="font-bold text-black text-lg">IS</span>
              </div>
              <div>
                <span className="font-bold text-xl">InstantSounds</span>
                <span className="ml-1 text-xs text-zinc-500">instant.blazenxt.in</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => setShowFavoritesModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-900 rounded-lg"
            >
              <Heart size={16} /> Favorites
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-900 rounded-lg"
            >
              <Upload size={16} /> Upload
            </button>
            <button 
              onClick={() => toast.info("Login coming soon")}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-black rounded-lg text-sm font-medium"
            >
              <User size={16} /> Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
        <div className="inline px-3 py-1 text-xs bg-zinc-900 rounded-full mb-4">🔥 Trending worldwide</div>
        
        <h1 className="text-5xl font-bold tracking-tighter mb-3">
          The largest instant sound buttons website
        </h1>
        <p className="text-zinc-400 text-lg">Click to play. No download. No signup needed.</p>

        {/* Search */}
        <div className="mt-8 max-w-md mx-auto relative">
          <Search className="absolute left-4 top-3.5 text-zinc-500" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sounds..."
            className="w-full bg-zinc-900 border border-zinc-800 pl-11 py-3 rounded-xl text-sm focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-6">
          {/* Country Tabs */}
          <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl">
            {(["All", "US", "IN"] as const).map(c => (
              <button
                key={c}
                onClick={() => setActiveCountry(c)}
                className={`px-5 py-1.5 text-sm rounded-lg transition-all ${activeCountry === c ? 'bg-white text-black' : 'hover:bg-zinc-800'}`}
              >
                {c === "All" ? "All" : c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="bg-zinc-900 border border-zinc-800 px-4 py-2 text-sm rounded-xl"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
            </select>
            <div className="text-sm text-zinc-400">{filteredSounds.length} sounds</div>
          </div>
        </div>
      </div>

      {/* Trending Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex items-center gap-2 mb-3 text-sm text-zinc-400">
          <TrendingUp size={16} /> Trending
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sounds.slice(0, 6).map(sound => (
            <button 
              key={sound.id} 
              onClick={() => playSound(sound)}
              className="text-sm whitespace-nowrap px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg"
            >
              {sound.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sound Grid - Classic Myinstants style */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredSounds.map(sound => {
            const isFav = favorites.includes(sound.id);
            const isPlaying = playingId === sound.id;

            return (
              <div key={sound.id} className="border border-zinc-800 bg-zinc-900 rounded-xl p-4 flex flex-col">
                <button 
                  onClick={() => playSound(sound)}
                  className="flex-1 flex items-center gap-3 bg-zinc-950 hover:bg-zinc-800 active:bg-zinc-700 border border-zinc-800 px-4 py-4 rounded-lg text-left transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Play size={18} className="text-black" fill="currentColor" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm leading-tight truncate">{sound.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{sound.category} • {sound.country}</div>
                  </div>
                </button>

                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="flex gap-1">
                    <button onClick={() => toggleFavorite(sound.id)} className={`p-1.5 rounded-lg hover:bg-zinc-800 ${isFav ? 'text-red-500' : 'text-zinc-400'}`}>
                      <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => copyLink(sound)} className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded-lg">
                      <LinkIcon size={16} />
                    </button>
                    <button onClick={() => shareSound(sound)} className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded-lg">
                      <Share2 size={16} />
                    </button>
                  </div>
                  
                  <a href={`/instant/${sound.slug}`} className="text-xs text-zinc-400 hover:text-white px-2 py-0.5">
                    View
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSounds.length === 0 && (
          <div className="text-center py-12 text-zinc-400">No results found.</div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
        Built on instant.blazenxt.in • Myinstants clone
      </footer>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl p-6">
            <div className="flex justify-between mb-5">
              <h3 className="font-semibold text-xl">Upload Sound</h3>
              <button onClick={() => setShowUploadModal(false)}><X /></button>
            </div>

            <input 
              value={uploadName} 
              onChange={e => setUploadName(e.target.value)} 
              placeholder="Sound name" 
              className="w-full bg-zinc-950 border border-zinc-700 px-4 py-3 rounded-xl mb-4" 
            />

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
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavoritesModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
          <div className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-700 flex justify-between">
              <div className="font-semibold">Favorites ({favorites.length})</div>
              <button onClick={() => setShowFavoritesModal(false)}><X /></button>
            </div>
            <div className="max-h-[60vh] overflow-auto p-4">
              {favoriteSounds.length > 0 ? favoriteSounds.map(s => (
                <div key={s.id} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-none">
                  <div>{s.name}</div>
                  <div className="flex gap-3">
                    <button onClick={() => playSound(s)} className="text-green-400"><Play size={16} /></button>
                    <button onClick={() => toggleFavorite(s.id)} className="text-red-400 text-sm">Remove</button>
                  </div>
                </div>
              )) : <div className="py-8 text-center text-zinc-400">No favorites yet</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
