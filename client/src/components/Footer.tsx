import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-gray-300 font-body border-t border-gold-900/20">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand & Heritage */}
          <div className="space-y-6">
            <Link to="/" className="block">
              <span className="font-display text-2xl font-bold tracking-wider text-gold-500">
                SIDDU POTADAR
              </span>
              <span className="block text-[9px] tracking-[0.25em] text-gold-200/80 uppercase">
                Gold & Silver Jewelry
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              A trusted name in Hukkeri, Karnataka, celebrated for generations. We specialize in handcrafted gold and silver jewelry, BIS Hallmarked for certified purity.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-dark transition-all duration-300">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-dark transition-all duration-300">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-dark transition-all duration-300">
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-display text-gold-500 text-lg font-semibold tracking-wider mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[1px] after:bg-gold-500">
              Explore Links
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/" className="hover:text-gold-400 transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-gold-400 transition-colors duration-200">Our Collection</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors duration-200">About Our Story</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-gold-400 transition-colors duration-200">Showroom Gallery</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-400 transition-colors duration-200">Get in Touch</Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-500 hover:text-gold-400 transition-colors duration-200">Admin Login</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="font-display text-gold-500 text-lg font-semibold tracking-wider mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[1px] after:bg-gold-500">
              Jewelry Collections
            </h3>
            <ul className="space-y-3.5 text-sm text-gray-400">
              <li>
                <Link to="/products?category=Gold Chains" className="hover:text-gold-400 transition-colors">Gold Chains</Link>
              </li>
              <li>
                <Link to="/products?category=Gold Necklaces" className="hover:text-gold-400 transition-colors">Gold Necklaces</Link>
              </li>
              <li>
                <Link to="/products?category=Gold Rings" className="hover:text-gold-400 transition-colors">Gold Rings & Bands</Link>
              </li>
              <li>
                <Link to="/products?category=Bridal Jewelry" className="hover:text-gold-400 transition-colors">Bridal Jewelry Sets</Link>
              </li>
              <li>
                <Link to="/products?category=Silver Jewelry" className="hover:text-gold-400 transition-colors">Silver Jewelry & Ornaments</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Store Information */}
          <div className="space-y-4">
            <h3 className="font-display text-gold-500 text-lg font-semibold tracking-wider mb-2 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[1px] after:bg-gold-500">
              Store Information
            </h3>
            <div className="flex items-start gap-3 text-sm text-gray-400 pt-2">
              <FiMapPin className="text-gold-500 w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Belgaum Rd, Gajabarwadi, Hukkeri, Karnataka 591309, India
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <FiPhone className="text-gold-500 w-5 h-5 flex-shrink-0" />
              <a href="tel:+918971012999" className="hover:text-gold-400 transition-colors">+91 89710 12999</a>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <FiMail className="text-gold-500 w-5 h-5 flex-shrink-0" />
              <a href="mailto:info@siddupotadar.com" className="hover:text-gold-400 transition-colors">info@siddupotadar.com</a>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <FiClock className="text-gold-500 w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p>Monday - Saturday</p>
                <p className="text-gold-400 font-medium">10:00 AM onwards</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Footer */}
      <div className="bg-dark-light py-6 border-t border-gold-900/10 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Siddu Potadar Jewellers. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
