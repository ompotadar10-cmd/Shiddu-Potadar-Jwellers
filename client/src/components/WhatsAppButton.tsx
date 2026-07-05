import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton: React.FC = () => {
  const number = '918971012999';
  const text = encodeURIComponent("Hello Siddu Potadar Jewellers, I visited your website and would like to inquire about your jewelry collection.");
  const whatsappUrl = `https://wa.me/${number}?text=${text}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 group flex flex-col items-end">
      {/* Tooltip */}
      <span className="mb-2 mr-1 px-3 py-1.5 bg-dark text-gold-400 text-xs font-semibold tracking-wide rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-gold-900/20 whitespace-nowrap">
        Chat with Us
      </span>

      {/* Main WhatsApp Float Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-emerald-500 text-white rounded-full shadow-2xl hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping -z-10 group-hover:animate-none" />
        
        {/* WhatsApp Icon */}
        <FaWhatsapp className="w-8 h-8" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
