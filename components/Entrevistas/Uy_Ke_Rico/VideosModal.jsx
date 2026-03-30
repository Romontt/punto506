import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Ajusta la ruta a tu cliente de supabase
import VideoCard from './VideoCard';

const VideosModal = ({ onClose }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase
        .from('videos_punto506')
        .select('*')
        .order('created_at', { ascending: false });
      setVideos(data || []);
    };
    fetchVideos();
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121212] border border-[#D4AF37]/30 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col relative">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-[#D4AF37] text-2xl font-serif font-bold uppercase tracking-tight">Entrevistas Punto 506</h2>
            <p className="text-gray-400 text-sm mt-1">Conoce quién está detrás de los negocios y emprendimientos locales.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={28} />
          </button>
        </div>

        {/* Grid de Videos */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((vid) => (
            <VideoCard key={vid.id} video={vid} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideosModal;
