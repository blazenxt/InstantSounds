"use client";

import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'R', description: 'Play random sound' },
    { key: 'F', description: 'Open favorites' },
    { key: 'Esc', description: 'Close modals' },
    { key: '?', description: 'Show this help' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-full text-sm transition-all active:scale-95"
      >
        <Keyboard size={16} />
        <span className="hidden sm:inline">Shortcuts</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-700 w-full max-w-sm rounded-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl flex items-center gap-2">
                  <Keyboard size={20} /> Keyboard Shortcuts
                </h3>
                <button onClick={() => setIsOpen(false)}><X /></button>
              </div>

              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl">
                    <span className="text-zinc-300">{shortcut.description}</span>
                    <div className="px-3 py-1 bg-zinc-800 rounded-lg font-mono text-sm text-green-400">
                      {shortcut.key}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 py-3 bg-white text-black rounded-xl font-medium"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
