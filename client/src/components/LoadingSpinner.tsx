import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      {/* Golden ring loading animation */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gold-200/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-gold-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="font-display text-gold-600 text-sm tracking-widest uppercase font-medium animate-pulse">
        Siddu Potadar
      </p>
    </div>
  );
};

export default LoadingSpinner;
