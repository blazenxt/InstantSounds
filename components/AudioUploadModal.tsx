"use client";

import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface AudioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newSound: any) => void;
}

export default function AudioUploadModal({ isOpen, onClose, onUploadSuccess }: AudioUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Memes");
  const [country, setCountry] = useState<"US" | "IN">("IN");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!selectedFile.type.startsWith('audio/')) {
        toast.error("Please select an audio file");
        return;
      }
      setFile(selectedFile);
      if (!name) setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async () => {
    if (!file || !name.trim()) {
      toast.error("Please select a file and enter a name");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `sounds/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('sounds')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('sounds')
        .getPublicUrl(filePath);

      const newSound = {
        id: Date.now(),
        name: name.trim(),
        slug: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        category,
        country,
        plays: 0,
        audio_url: publicUrl,
      };

      onUploadSuccess(newSound);
      toast.success("Sound uploaded successfully!");
      onClose();

      // Reset form
      setFile(null);
      setName("");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-md rounded-2xl p-6">
        <div className="flex justify-between mb-5">
          <h3 className="font-semibold text-xl">Upload Audio</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Audio File</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-2xl cursor-pointer hover:border-green-500 transition-colors">
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                <p className="text-sm text-zinc-400">
                  {file ? file.name : "Click to upload MP3/WAV (max 5MB)"}
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
            onClick={onClose}
            className="flex-1 py-3 border border-zinc-700 hover:bg-zinc-800 rounded-2xl font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={uploading || !file}
            className="flex-1 py-3 bg-green-500 text-black font-semibold rounded-2xl hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Sound"}
          </button>
        </div>
      </div>
    </div>
  );
}
