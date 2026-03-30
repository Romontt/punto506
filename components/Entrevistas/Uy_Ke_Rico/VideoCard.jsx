import React from 'react';

const VideoCard = ({ video }) => {
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.video_id}`;

  return (
    <div 
      onClick={() => window.open(youtubeUrl, '_blank')}
      className="group cursor-pointer bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-all shadow-lg"
    >
      {/* Contenedor del Video Embed (Modo visual) */}
      <div className="aspect-video relative overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.video_id}?controls=0&rel=0`}
          title={video.nombre_negocio}
          className="pointer-events-none" // Para que el clic del div mande a YouTube directamente
          frameBorder="0"
        ></iframe>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all flex items-center justify-center">
             {/* Icono de play opcional que aparece al hacer hover */}
        </div>
      </div>

      {/* Info del Negocio */}
      <div className="p-4">
        <h3 className="text-[#D4AF37] font-bold text-lg uppercase leading-tight group-hover:text-white transition-colors">
          {video.nombre_negocio}
        </h3>
        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
          {video.descripcion_corta}
        </p>
        <div className="mt-4 flex items-center text-[10px] text-gray-500 font-bold tracking-widest uppercase">
          Ver en YouTube →
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
