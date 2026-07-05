import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types';
import ImagePlaceholder from './ImagePlaceholder';
import { FiArrowRight } from 'react-icons/fi';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images && product.images.length > 0 ? product.images[0].image_url : null;

  // Format availability label & color
  const getAvailabilityBadge = () => {
    switch (product.availability) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            In Stock
          </span>
        );
      case 'made_to_order':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Made to Order
          </span>
        );
      case 'out_of_stock':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Out of Stock
          </span>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-gold-500/20 transition-all duration-300 flex flex-col h-full"
    >
      {/* Product Image Area */}
      <Link to={`/products/${product.id}`} className="relative aspect-[4/3] block overflow-hidden bg-gray-50 border-b border-gray-100">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <ImagePlaceholder category={product.category} className="w-full h-full" />
        )}
        
        {/* Hover overlay button */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/95 text-dark text-xs uppercase font-semibold tracking-wider px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
            View Details <FiArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>

      {/* Info Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category & Status */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded">
              {product.category}
            </span>
            {getAvailabilityBadge()}
          </div>

          {/* Product Name */}
          <h3 className="font-display text-base font-bold text-dark group-hover:text-gold-600 transition-colors duration-200 leading-snug line-clamp-1">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>

          {/* Description Snippet */}
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Specs & Pricing Footer */}
        <div className="pt-4 mt-4 border-t border-gray-100 flex items-end justify-between">
          <div className="text-[11px] text-gray-400 space-y-0.5">
            <p>Weight: <span className="font-semibold text-gray-600">{product.weight || 'N/A'}</span></p>
            {product.show_purity && product.purity && (
              <p>Purity: <span className="font-semibold text-gray-600">{product.purity}</span></p>
            )}
          </div>
          
          <div className="text-right">
            {product.show_price && product.price ? (
              <span className="text-sm font-bold text-dark font-body">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            ) : (
              <span className="text-[10px] text-gold-600 font-semibold tracking-wide block pb-0.5">
                Price on Request
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
