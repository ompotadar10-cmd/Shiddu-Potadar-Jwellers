import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiPhoneCall } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-dark shadow-lg border-b border-gold-900/10 py-4' 
            : isHomePage 
            ? 'bg-transparent py-6' 
            : 'bg-dark py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex flex-col">
              <span className="font-display text-2xl md:text-3xl font-bold tracking-wider text-gold-500 hover:text-gold-400 transition-colors duration-300">
                SIDDU POTADAR
              </span>
              <span className="text-[9px] tracking-[0.25em] text-gold-200/80 font-body uppercase text-center md:text-left">
                Gold & Silver Jewelry
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `font-body text-sm font-medium tracking-wide transition-colors duration-300 relative py-1 hover:text-gold-400 ${
                      isActive 
                        ? 'text-gold-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-gold-500' 
                        : isHomePage && !isScrolled 
                        ? 'text-white/90' 
                        : 'text-gray-300'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="tel:+918971012999"
                className={`flex items-center gap-2 text-sm font-medium hover:text-gold-400 transition-colors duration-300 ${
                  isHomePage && !isScrolled ? 'text-white' : 'text-gray-300'
                }`}
              >
                <FiPhoneCall className="text-gold-500" />
                <span>+91 89710 12999</span>
              </a>
              <Link
                to="/inquiry"
                className="gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-semibold text-xs uppercase tracking-wider py-2.5 px-5 rounded transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/20"
              >
                Inquire Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gold-500 hover:text-gold-400 p-2 focus:outline-none"
              >
                {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-dark-light border-b border-gold-900/20"
            >
              <div className="px-4 pt-2 pb-6 space-y-3">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `block px-3 py-2.5 rounded text-base font-medium tracking-wide border-l-2 ${
                        isActive
                          ? 'border-gold-500 bg-dark text-gold-500'
                          : 'border-transparent text-gray-300 hover:bg-dark/50 hover:text-gold-400'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                
                <div className="pt-4 border-t border-gold-900/10 flex flex-col gap-4">
                  <a
                    href="tel:+918971012999"
                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-gold-400"
                  >
                    <FiPhoneCall className="text-gold-500 w-5 h-5" />
                    <span className="text-base font-medium">+91 89710 12999</span>
                  </a>
                  <Link
                    to="/inquiry"
                    className="block text-center gold-gradient text-dark font-semibold py-3 px-4 rounded transition-all duration-300"
                  >
                    Inquire Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Spacer for non-home pages */}
      {!isHomePage && <div className="h-20 bg-dark"></div>}
    </>
  );
};

export default Navbar;
