"use client";

import React, { useState } from 'react';
import { X, Upload, Play } from 'lucide-react';
import { toast } from 'sonner';

interface RealAudioUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newSound: any) => void;
}

export default function RealAudioUpload({ isOpen, onClose, onUploadSuccess }: RealAudioUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Memes");
  const [country, setCountry] = useState<"US" | "IN">("IN");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 8 * 1024 * 1024) {
        toast.error("File size must be less than 8MB");
        return;
      }
      if (!selectedFile.type.startsWith('audio/')) {
        toast.error("Please select an audio file (MP3, WAV, OGG)");
        return;
      }
      
      setFile(selectedFile);
      
      // Create temporary URL for preview
      const url = URL.createObjectURL(selectedFile);
      setAudioUrl(url);
      
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = () => {
    if (!file || !name.trim() || !audioUrl) {
      toast.error("Please select a file and enter a name");
      return;
    }

    const newSound = {
      id: Date.now(),
      name: name.trim(),
      slug: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      category,
      country,
      plays: 0,
      audio_url: audioUrl,           // Real blob URL
      isLocalUpload: true,           // Flag to identify local uploads
      fileName: file.name
    };

    onUploadSuccess(newSound);
    toast.success("Audio uploaded successfully!");
    onClose();

    // Reset form
    setFile(null);
    setName("");
    setAudioUrl(null);
  };

  const handleClose = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setFile(null);
    setName("");
    setAudioUrl(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl p-6">
        <div className="flex justify-between mb-5">
          <h3 className="font-semibold text-xl">Upload Real Audio</h3>
          <button onClick={handleClose}><X /></button>
        </div>

        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Audio File</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-2xl cursor-pointer hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                <p className="text-sm text-zinc-400 text-center">
                  {file ? file.name : "Click to upload MP3, WAV, OGG (max 8MB)"}
                </p>
              </div>
              <input 
                type="file" 
                accept="audio/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>

          {/* Audio Preview */}
          {audioUrl && (
            <div className="bg-zinc-950 border border-zinc-700 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Play size={16} className="text-black" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Preview</div>
                  <audio controls src={audioUrl} className="w-full mt-1" />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Sound Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My awesome sound"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-2xl focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-2xl"
              >
                <option>Memes</option>
                <option>Funny</option>
                <option>Gaming</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Country</label>
              <select 
                value={country}
                onChange={(e) => setCountry(e.target.value as any)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-700 rounded-2xl"
              >
                <option value="IN">India</option>
                <option value="US">United States</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button 
            onClick={handleClose}
            className="flex-1 py-3 border border-zinc-700 hover:bg-zinc-800 rounded-2xl font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={!file || !name.trim()}
            className="flex-1 py-3 bg-green-500 text-black font-semibold rounded-2xl hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            Upload Audio
          </button>
        </div>

        <p className="text-xs text-center text-zinc-500 mt-4">
          Audio plays directly from your browser
        </p>
      </div>
    </div>
  );
}
