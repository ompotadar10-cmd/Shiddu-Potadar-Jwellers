import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiClock, FiStar, FiChevronRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getProduct, getProducts } from '../services/api';
import { Product } from '../types';
import ImagePlaceholder from '../components/ImagePlaceholder';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ScrollReveal from '../components/ScrollReveal';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const prodId = parseInt(id, 10);
        const data = await getProduct(prodId);
        setProduct(data);
        
        // Initial selected image
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].image_url);
        } else {
          setSelectedImage(null);
        }

        // Fetch related products (same category)
        if (data.category) {
          const relData = await getProducts({ category: data.category, limit: 5 });
          const filtered = (relData.products || []).filter((p) => p.id !== prodId).slice(0, 4);
          setRelated(filtered);
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="bg-gray-50 min-h-[600px] flex items-center justify-center font-body">
        <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="text-4xl mb-4">💍</div>
          <h2 className="font-display text-xl font-bold text-dark mb-2">Design Not Found</h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            The jewelry design you are trying to view doesn't exist or has been removed from our catalog.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="gold-gradient text-dark text-xs uppercase font-bold tracking-wider py-2.5 px-6 rounded inline-flex items-center gap-2"
          >
            <FiArrowLeft /> Back to Collection
          </button>
        </div>
      </div>
    );
  }

  const handleInquiryRedirect = () => {
    navigate(`/inquiry?interest=${encodeURIComponent(product.category)}&product=${encodeURIComponent(product.name)}`);
  };

  const getWhatsAppUrl = () => {
    const number = '919019777333';
    const text = encodeURIComponent(`Hello Siddu Potadar Jewellers, I'm interested in inquiring about the "${product.name}" (${product.category}) with specifications Weight: ${product.weight}, Purity: ${product.purity}. Please share more details.`);
    return `https://wa.me/${number}?text=${text}`;
  };

  return (
    <div className="bg-gray-50 py-12 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-8 flex-wrap">
          <Link to="/" className="hover:text-gold-600 transition-colors">Home</Link>
          <FiChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-gold-600 transition-colors">All Collections</Link>
          <FiChevronRight className="w-3 h-3" />
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-gold-600 transition-colors">
            {product.category}
          </Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-gray-600 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* ─── TWO COLUMN DETAIL AREA ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-12 mb-16">
          
          {/* Left Column: Image Area */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlaceholder category={product.category} className="w-full h-full" />
              )}
            </div>
            
            {/* Gallery Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-2 scrollbar-thin">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`relative w-20 aspect-video rounded overflow-hidden border-2 transition-all flex-shrink-0 bg-gray-50 ${
                      selectedImage === img.image_url ? 'border-gold-500' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specification Area */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Category & Status */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-600 bg-gold-50 px-3 py-1 rounded">
                  {product.category}
                </span>
                
                {product.availability === 'in_stock' && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Ready in Showroom
                  </span>
                )}
                {product.availability === 'made_to_order' && (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Custom Order Only
                  </span>
                )}
                {product.availability === 'out_of_stock' && (
                  <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark leading-tight">
                {product.name}
              </h1>

              {/* Price / Request Block */}
              <div className="border-y border-gray-100 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Showroom Price</p>
                  {product.show_price && product.price ? (
                    <span className="text-2xl font-bold text-dark font-body">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-lg font-bold text-gold-600 font-display">
                      Price Available on Request
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-sm">
                  <FiStar className="fill-current" />
                  <span className="font-semibold text-dark">4.5</span>
                  <span className="text-gray-400 text-xs">(Store rating)</span>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-dark">Design Description</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.description || 'No detailed description available for this handcrafted jewelry piece.'}
                </p>
              </div>

              {/* Specs Grid */}
              <div className={`grid grid-cols-${(product.show_purity && product.purity) ? '2' : '1'} gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100`}>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Net Weight</span>
                  <span className="text-sm font-semibold text-dark">{product.weight || 'N/A'}</span>
                </div>
                {product.show_purity && product.purity && (
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Gold Purity / Grade</span>
                    <span className="text-sm font-semibold text-dark">{product.purity}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inquire Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <button
                onClick={handleInquiryRedirect}
                className="gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-bold text-xs uppercase tracking-wider py-4 px-6 rounded shadow-lg shadow-gold-500/10 hover:shadow-gold-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FiShoppingCart className="w-4 h-4" /> Send Shop Inquiry
              </button>
              
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="w-4.5 h-4.5" /> Inquiry on WhatsApp
              </a>
            </div>

          </div>
        </div>

        {/* ─── RELATED PRODUCTS SECTION ───────────────────────────────────── */}
        {related.length > 0 && (
          <ScrollReveal direction="up">
            <h2 className="font-display text-2xl font-bold tracking-wide text-dark mb-2 text-center lg:text-left">
              Related Designs from Category
            </h2>
            <div className="w-12 h-[2px] bg-gold-500 mb-8 mx-auto lg:mx-0" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </ScrollReveal>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
