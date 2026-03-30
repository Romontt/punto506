import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase'; // Asegúrate que esta ruta sea correcta
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#0f0f0f] border border-[#D4AF37]/30 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl flex flex-col relative">
        
        {/* Encabezado */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-[#D4AF37] text-2xl font-bold uppercase">Entrevistas Punto 506</h2>
            <p className="text-gray-400 text-sm">Conoce quién está detrás de los negocios y emprendimientos.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={28} />
          </button>
        </div>

        {/* Cuadrícula de videos */}
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
