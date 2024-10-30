import { useState } from 'react';
import { Music2, X } from 'lucide-react';

const SpotifyPlayer = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="bg-green-500 hover:bg-green-600 transition-colors duration-300 p-3 rounded-full shadow-lg"
        >
          <Music2 className="w-6 h-6 text-white" />
        </button>
      )}
      
      {isVisible && (
        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`
            transform transition-all duration-300 ease-in-out
            ${isHovered ? 'scale-102 translate-y-[-4px]' : 'scale-100'}
            bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-xl
            shadow-2xl shadow-purple-500/20
          `}>
            <button
              onClick={() => setIsVisible(false)}
              className="absolute -top-2 -right-2 bg-gray-800 hover:bg-gray-700 
                        p-1 rounded-full shadow-lg transition-colors duration-300"
            >
              <X className="w-4 h-4 text-gray-300" />
            </button>
            
            <iframe
              className="rounded-lg border-2 border-purple-500/30 
                        group-hover:border-purple-400/50 transition-colors duration-300"
              src="https://open.spotify.com/embed/playlist/2YC6RDAdPt3J4yD2aJMtjt?utm_source=generator&theme=0"
              width="380"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;