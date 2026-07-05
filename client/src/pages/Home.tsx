import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiSliders, FiAward, FiMessageSquare, FiStar, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';
import { getProducts, getCategories } from '../services/api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';
import LoadingSpinner from '../components/LoadingSpinner';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodData = await getProducts({ featured: 'true', limit: 4 });
        setFeaturedProducts(prodData.products || []);
        
        const catData = await getCategories();
        setCategories(catData || []);
      } catch (err) {
        console.error('Error fetching home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      title: 'Certified Purity',
      description: 'Every piece of our gold jewelry carries 100% BIS Hallmarking, guaranteeing pure quality.',
      icon: FiShield,
    },
    {
      title: 'Handcrafted Heritage',
      description: 'Ornate designs handcrafted by master artisans with centuries-old Indian goldsmithing expertise.',
      icon: FiAward,
    },
    {
      title: 'Bespoke Customization',
      description: 'Translate your vision into precious metal. We craft custom-designed ornaments per your preferences.',
      icon: FiSliders,
    },
    {
      title: 'Exemplary Trust',
      description: 'Serving families across generations with transparent pricing and exceptional customer care.',
      icon: FiMessageSquare,
    },
  ];

  return (
    <div className="font-body overflow-x-hidden">
      {/* ─── 1. HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-dark flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Shimmer Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(184,134,11,0.12)_0%,transparent_50%),radial-gradient(circle_at_70%_70%,rgba(212,175,55,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#3d3d3d_1px,transparent_1px),linear-gradient(to_bottom,#3d3d3d_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Light Shimmer Effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white select-none">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold-500 font-display text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase mb-4"
          >
            Welcome to the Showroom of
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl font-bold tracking-wider leading-tight text-white filter drop-shadow-sm mb-6"
          >
            SIDDU POTADAR
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-gray-300 font-body text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-light"
          >
            Discover handcrafted gold and silver jewelry that celebrates ancient heritage and modern elegance. Trusted for generations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-5 items-center justify-center"
          >
            <Link
              to="/products"
              className="w-full sm:w-auto gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-semibold text-sm uppercase tracking-wider py-4 px-8 rounded shadow-lg shadow-gold-500/10 hover:shadow-gold-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Explore Collection <FiArrowRight />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto border border-gold-500/50 hover:bg-gold-500/10 text-gold-500 font-semibold text-sm uppercase tracking-wider py-4 px-8 rounded transition-all duration-300 hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase">Scroll Down</span>
          <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
        </div>
      </section>

      {/* ─── 2. WHY CHOOSE US ──────────────────────────────────────────────── */}
      <section className="bg-white py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-wide text-dark">
              Why Siddu Potadar Jewellers?
            </h2>
            <div className="w-16 h-[2px] bg-gold-500 mx-auto mt-4 mb-6" />
            <p className="text-gray-500 text-sm leading-relaxed">
              We uphold the highest standards of integrity and quality, ensuring every piece you purchase becomes a treasured heritage heirloom.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal
                  key={item.title}
                  direction="up"
                  delay={idx * 0.1}
                  className="bg-gray-50 p-8 rounded-lg border border-gray-100 hover:border-gold-500/20 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gold-50 flex items-center justify-center text-gold-600 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-dark mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 3. FEATURED PRODUCTS ─────────────────────────────────────────── */}
      <section className="bg-gray-50 py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-wide text-dark">
                Our Finest Ornaments
              </h2>
              <div className="w-16 h-[2px] bg-gold-500 mt-3 mb-4 mx-auto sm:mx-0" />
              <p className="text-gray-500 text-sm max-w-lg">
                Handpicked featured masterpieces showcasing the ultimate elegance of traditional South Indian designs.
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors flex items-center gap-2 group"
            >
              View Full Collection 
              <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>

          {loading ? (
            <LoadingSpinner />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ScrollReveal key={product.id} direction="up" className="h-full">
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              No products featured at the moment. Keep exploring!
            </div>
          )}
        </div>
      </section>

      {/* ─── 4. COLLECTIONS SHOWCASE ───────────────────────────────────────── */}
      <section className="bg-dark py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold-500 uppercase tracking-widest text-xs font-semibold">Exquisite Designs</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-wide mt-2">
              Browse by Category
            </h2>
            <div className="w-16 h-[2px] bg-gold-500 mx-auto mt-4 mb-6" />
            <p className="text-gray-400 text-sm">
              Discover beautiful gold chains, necklaces, bridal rings, jhumkas, and premium sterling silver ornaments.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((category, idx) => (
              <ScrollReveal
                key={category.id}
                direction="up"
                delay={idx * 0.1}
                className="relative h-64 rounded-lg overflow-hidden group border border-gold-900/10 cursor-pointer"
              >
                {/* Visual Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-900/40 via-dark-light/95 to-black/80 group-hover:from-gold-900/50 group-hover:via-dark-light/90 group-hover:to-black/90 transition-all duration-500" />
                
                {/* Corner details */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-gold-500/20 group-hover:border-gold-500/45 transition-colors duration-300" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-gold-500/20 group-hover:border-gold-500/45 transition-colors duration-300" />

                <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center border border-gold-500/20 text-gold-500">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">
                      {category.description}
                    </p>
                    <Link
                      to={`/products?category=${encodeURIComponent(category.name)}`}
                      className="text-xs font-semibold text-gold-500 flex items-center gap-2 group-hover:text-gold-400 transition-colors"
                    >
                      View Collection <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. TRUST & GOOGLE RATING SECTION ─────────────────────────────── */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            
            <ScrollReveal className="bg-dark text-white p-8 sm:p-12 rounded-lg border border-gold-900/10 lg:col-span-2">
              <span className="text-gold-500 uppercase tracking-widest text-[10px] font-bold">Showroom Statistics</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide mt-2 mb-6">
                Legacy Built on Pure Trust
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="border-t border-gold-900/30 pt-6">
                  <div className="font-display text-3xl font-bold text-gold-500">25+ Years</div>
                  <div className="text-xs text-gray-400 mt-1">Generational Heritage</div>
                </div>
                <div className="border-t border-gold-900/30 pt-6">
                  <div className="font-display text-3xl font-bold text-gold-500">10,000+</div>
                  <div className="text-xs text-gray-400 mt-1">Happy Customer Families</div>
                </div>
                <div className="border-t border-gold-900/30 pt-6">
                  <div className="font-display text-3xl font-bold text-gold-500">100%</div>
                  <div className="text-xs text-gray-400 mt-1">BIS Hallmarked Purity</div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="bg-gray-50 p-8 rounded-lg border border-gray-100 flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 text-amber-500 mb-4 text-2xl">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current/50" />
              </div>
              <h3 className="font-display text-xl font-bold text-dark mb-1">
                4.5 / 5 Rating
              </h3>
              <p className="text-xs text-gray-400 mb-6 font-semibold uppercase tracking-wider">
                Google Business Reviews
              </p>
              <p className="text-xs text-gray-500 leading-relaxed mb-6 italic">
                "Outstanding customer service and beautiful collection. The craftsmanship of their gold bangles is unparalleled. Pure trust."
              </p>
              <span className="text-[10px] font-bold text-dark font-body uppercase tracking-widest">
                — Hukkeri Customer
              </span>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ─── 6. CONTACT STRIP ─────────────────────────────────────────────── */}
      <section className="bg-cream/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5">
                <FiMapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-dark mb-1">Store Location</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Belgaum Rd, Gajabarwadi, Hukkeri, Karnataka 591309, India
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5">
                <FiPhone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-dark mb-1">Call Store</h4>
                <a href="tel:+919019777333" className="text-xs text-gray-500 hover:text-gold-600 transition-colors font-medium">
                  +91 90197 77333
                </a>
                <p className="text-[10px] text-gray-400">Click to place direct call</p>
              </div>
            </ScrollReveal>
            <ScrollReveal className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5">
                <FiClock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-dark mb-1">Business Hours</h4>
                <p className="text-xs text-gray-500">Monday to Saturday</p>
                <p className="text-xs text-gold-600 font-bold">10:00 AM - 8:00 PM</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
