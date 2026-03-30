import React, { useState } from 'react';
import { Youtube } from 'lucide-react';
import VideosModal from './VideosModal';

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* El botón que flota */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2 bg-black border-2 border-[#D4AF37] text-[#D4AF37] px-4 py-3 rounded-full shadow-lg hover:scale-110 transition-all"
      >
        <Youtube className="text-red-600" size={24} fill="currentColor" />
        <span className="font-bold text-xs uppercase tracking-widest">Entrevistas</span>
      </button>

      {/* Si el estado es abierto, muestra el modal */}
      {isOpen && <VideosModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default FloatingButton;
