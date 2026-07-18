"use client";

import React, { useState } from 'react';
import { Play, Heart, Link as LinkIcon, Share2, Search, Upload, User, X, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

// Enhanced sounds data (30+ sounds)
const allSounds = [
  // US Trending
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

  // India Trending
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

  // Extra Popular Sounds
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
  
  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Memes");
  const [uploadCountry, setUploadCountry] = useState<"US" | "IN">("IN");

  // Filter + Sort sounds
  const filteredSounds = sounds
    .filter(sound => {
      const matchesSearch = 
        sound.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sound.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = activeCountry === "All" || sound.country === activeCountry;
      
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.plays - a.plays;
      return b.id - a.id; // newest
    });

  // Get favorite sounds
  const favoriteSounds = sounds.filter(sound => favorites.includes(sound.id));

  // Play sound
  const playSound = (sound: Sound) => {
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

    gainNode.gain.value = 0.25;

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator1.start();
    oscillator2.start();

    setPlayingId(sound.id);

    const duration = 800 + (sound.id % 5) * 160;
    
    setTimeout(() => {
      oscillator1.stop();
      oscillator2.stop();
      setPlayingId(null);
    }, duration);

    toast.success(`Playing: ${sound.name}`, {
      duration: duration,
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
      } catch (error) {}
    } else {
      copyLink(sound);
    }
  };

  // Handle Upload
  const handleUpload = () => {
    if (!uploadName.trim()) {
      toast.error("Please enter a sound name");
      return;
    }

    const newSound: Sound = {
      id: Date.now(),
      name: uploadName.trim(),
      slug: uploadName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      category: uploadCategory,
      country: uploadCountry,
      plays: 1,
    };

    setSounds([newSound, ...sounds]);
    
    toast.success(`Sound uploaded: ${uploadName}`);
    
    // Reset form
    setUploadName("");
    setShowUploadModal(false);
    
    // Auto play the new sound
    setTimeout(() => {
      playSound(newSound);
    }, 600);
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

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFavoritesModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-colors"
            >
              <Heart size={16} /> Favorites ({favorites.length})
            </button>
            
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-colors"
            >
              <Upload size={16} /> Upload
            </button>
            
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

      {/* Country Tabs + Stats + Sort */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6">
          
          {/* Country Filter Tabs */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-1">
            {(["All", "US", "IN"] as const).map((country) => (
              <button
                key={country}
                onClick={() => setActiveCountry(country)}
                className={`px-6 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeCountry === country 
                    ? "bg-white text-black shadow" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {country === "All" ? "🌍 All" : country === "US" ? "🇺🇸 US" : "🇮🇳 India"}
              </button>
            ))}
          </div>

          {/* Sort + Stats */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-zinc-900 border border-zinc-800 text-sm px-4 py-2 rounded-2xl"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="flex items-center gap-8 text-sm">
              <div>
                <span className="font-mono text-2xl font-semibold text-green-400">30,284</span>
                <span className="ml-2 text-zinc-400">sounds</span>
              </div>
              <div>
                <span className="font-mono text-2xl font-semibold text-green-400">4.8m</span>
                <span className="ml-2 text-zinc-400">plays today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <TrendingUp className="text-green-400" size={22} />
          <h2 className="font-semibold text-xl">Trending Right Now</h2>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
          {sounds.slice(0, 8).map((sound) => (
            <button 
              key={sound.id}
              onClick={() => playSound(sound)}
              className="flex-shrink-0 bg-zinc-900 border border-zinc-800 hover:border-green-500/50 px-5 py-3 rounded-2xl text-left min-w-[220px]"
            >
              <div className="font-medium text-sm truncate">{sound.name}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{sound.plays.toLocaleString()} plays</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sound Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {filteredSounds.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            No sounds found for &quot;{searchTerm}&quot;
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
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-xs text-zinc-500">{sound.category}</div>
                        <div className="text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">
                          {sound.country}
                        </div>
                      </div>
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

                    <a 
                      href={`/instant/${sound.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 rounded-full transition-colors"
                    >
                      View
                    </a>
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Upload New Sound</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-zinc-400 hover:text-white">
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">Sound Name</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. My Epic Fart"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-2xl focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Category</label>
                  <select 
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-2xl focus:outline-none"
                  >
                    <option>Memes</option>
                    <option>Funny</option>
                    <option>Gaming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Country</label>
                  <select 
                    value={uploadCountry}
                    onChange={(e) => setUploadCountry(e.target.value as "US" | "IN")}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-2xl focus:outline-none"
                  >
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-3 border border-zinc-700 hover:bg-zinc-800 rounded-2xl font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                className="flex-1 py-3 bg-green-500 text-black font-semibold rounded-2xl hover:bg-green-600 transition-colors"
              >
                Upload Sound
              </button>
            </div>
            
            <p className="text-xs text-center text-zinc-500 mt-4">
              MP3 files up to 2MB supported (demo)
            </p>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavoritesModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-zinc-700">
              <h3 className="text-2xl font-semibold">Your Favorites ({favorites.length})</h3>
              <button onClick={() => setShowFavoritesModal(false)} className="text-zinc-400 hover:text-white">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[60vh]">
              {favoriteSounds.length > 0 ? (
                <div className="grid gap-4">
                  {favoriteSounds.map((sound) => (
                    <div key={sound.id} className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                      <div>
                        <div className="font-semibold">{sound.name}</div>
                        <div className="text-xs text-zinc-500">{sound.category} • {sound.country}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => playSound(sound)} 
                          className="px-4 py-2 bg-green-500 text-black rounded-xl text-sm font-medium flex items-center gap-2"
                        >
                          <Play size={16} /> Play
                        </button>
                        <button 
                          onClick={() => toggleFavorite(sound.id)} 
                          className="px-4 py-2 border border-zinc-700 rounded-xl text-sm text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-400">
                  No favorites yet.<br />Heart some sounds to save them here.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
