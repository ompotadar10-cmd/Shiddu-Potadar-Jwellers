import React from 'react';
import { GiNecklace, GiGoldBar, GiEarrings, GiSparkles, GiBigDiamondRing } from 'react-icons/gi';

interface ImagePlaceholderProps {
  category?: string;
  className?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ category = '', className = 'w-full h-full' }) => {
  // Select icon based on category
  const getIcon = () => {
    const cat = category.toLowerCase();
    if (cat.includes('chain')) return <GiNecklace className="w-16 h-16 text-gold-200/50" />;
    if (cat.includes('ring')) return <GiBigDiamondRing className="w-16 h-16 text-gold-200/50" />;
    if (cat.includes('earring')) return <GiEarrings className="w-16 h-16 text-gold-200/50" />;
    if (cat.includes('necklace') || cat.includes('bridal')) return <GiNecklace className="w-20 h-20 text-gold-200/50" />;
    if (cat.includes('bangle')) return <GiSparkles className="w-16 h-16 text-gold-200/50" />;
    return <GiGoldBar className="w-16 h-16 text-gold-200/50" />;
  };

  // Luxury gradient styles based on category hash
  const getGradient = () => {
    const cat = category.toLowerCase();
    if (cat.includes('ring')) return 'from-[#1E1911] via-[#2F271B] to-[#120F0A]';
    if (cat.includes('necklace') || cat.includes('bridal')) return 'from-[#1B1A1D] via-[#2A2733] to-[#0F0E12]';
    if (cat.includes('earring')) return 'from-[#111A1B] via-[#1C2C2E] to-[#0A1011]';
    return 'from-[#1E1A13] via-[#352D20] to-[#14110C]'; // Default rich gold/black gradient
  };

  return (
    <div className={`relative flex flex-col items-center justify-center bg-gradient-to-br ${getGradient()} ${className} overflow-hidden border border-gold-900/10`}>
      {/* Decorative Shimmer Ring */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] animate-pulse" />
      
      {/* Corner borders */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold-500/20" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold-500/20" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-gold-500/20" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold-500/20" />
      
      {/* Icon */}
      <div className="relative z-10 transform hover:scale-105 transition-transform duration-500 filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.2)]">
        {getIcon()}
      </div>
      
      {/* Luxury Brand Stamp */}
      <div className="absolute bottom-6 text-[8px] uppercase tracking-[0.4em] font-medium text-gold-500/40 select-none">
        Siddu Potadar
      </div>
    </div>
  );
};

export default ImagePlaceholder;
