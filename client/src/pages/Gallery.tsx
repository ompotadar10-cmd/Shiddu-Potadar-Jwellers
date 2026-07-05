import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import { Product } from '../types';
import ImagePlaceholder from '../components/ImagePlaceholder';
import LoadingSpinner from '../components/LoadingSpinner';
import ScrollReveal from '../components/ScrollReveal';
import { FiX, FiZoomIn, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Gallery: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const data = await getProducts({ limit: 40 });
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryImages();
  }, []);

  const openLightbox = (idx: number) => {
    setActiveIdx(idx);
  };

  const closeLightbox = () => {
    setActiveIdx(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : products.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx === null) return;
    setActiveIdx((prev) => (prev !== null && prev < products.length - 1 ? prev + 1 : 0));
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') handlePrev(e as any);
      if (e.key === 'ArrowRight') handleNext(e as any);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx]);

  return (
    <div className="bg-gray-50 min-h-screen py-12 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <span className="text-gold-600 font-bold uppercase tracking-widest text-xs">Visual Showroom</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-wide text-dark mt-2 mb-4">
            Jewelry Showcase Gallery
          </h1>
          <div className="w-16 h-[2px] bg-gold-500 mx-auto" />
          <p className="text-gray-500 text-xs mt-4 max-w-md mx-auto">
            Take a visual tour through our beautifully designed luxury ornaments. Click any card to expand high-resolution display.
          </p>
        </ScrollReveal>

        {loading ? (
          <LoadingSpinner />
        ) : products.length > 0 ? (
          /* Masonry Grid */
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {products.map((product, idx) => {
              const image = product.images && product.images.length > 0 ? product.images[0].image_url : null;
              
              return (
                <ScrollReveal
                  key={product.id}
                  direction="up"
                  delay={(idx % 4) * 0.05}
                  className="break-inside-avoid bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group relative cursor-pointer"
                >
                  <div onClick={() => openLightbox(idx)} className="relative block overflow-hidden bg-gray-100 aspect-[4/3] sm:aspect-auto">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <ImagePlaceholder category={product.category} className="w-full py-20" />
                    )}

                    {/* Hover Zoom Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/95 text-dark flex items-center justify-center shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <FiZoomIn className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-4 border-t border-gray-50 flex items-center justify-between gap-3 bg-white">
                    <div>
                      <h3 className="font-display font-bold text-sm text-dark line-clamp-1">{product.name}</h3>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            No gallery items available.
          </div>
        )}

        {/* ─── LIGHTBOX MODAL ──────────────────────────────────────────────── */}
        {activeIdx !== null && (
          <div
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Left Navigate */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Navigate */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>

            {/* Main Lightbox Content */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] w-full flex flex-col justify-center items-center gap-4 cursor-default"
            >
              <div className="relative max-h-[75vh] rounded overflow-hidden shadow-2xl bg-dark flex items-center justify-center border border-white/10">
                {products[activeIdx].images && products[activeIdx].images.length > 0 ? (
                  <img
                    src={products[activeIdx].images[0].image_url}
                    alt={products[activeIdx].name}
                    className="max-w-full max-h-[75vh] object-contain"
                  />
                ) : (
                  <ImagePlaceholder category={products[activeIdx].category} className="w-[600px] h-[400px]" />
                )}
              </div>

              {/* Caption Overlay */}
              <div className="text-center text-white space-y-1 mt-2 max-w-lg">
                <h2 className="font-display text-xl font-bold tracking-wide">{products[activeIdx].name}</h2>
                <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                  <span>Category: <strong className="text-gold-500">{products[activeIdx].category}</strong></span>
                  <span>•</span>
                  <span>Weight: <strong className="text-gold-500">{products[activeIdx].weight || 'N/A'}</strong></span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Gallery;
