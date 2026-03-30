import React, { useState } from 'react';
import { Youtube } from 'lucide-react';
import VideosModal from './VideosModal';

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2 bg-black border-2 border-[#D4AF37] text-[#D4AF37] px-4 py-3 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-110 transition-all group"
      >
        <Youtube className="text-red-600 group-hover:scale-110 transition-transform" size={24} fill="currentColor" />
        <span className="font-bold text-xs tracking-widest uppercase">Entrevistas</span>
      </button>

      {isOpen && <VideosModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default FloatingButton;
