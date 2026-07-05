import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { createInquiry } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import ScrollReveal from '../components/ScrollReveal';

const Contact: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    message: '',
    product_interest: 'General Inquiry',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.phone) {
      showError('Name and Phone number are required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await createInquiry(formData);
      showSuccess('Thank you for contacting us! We will respond shortly.');
      setFormData({
        customer_name: '',
        phone: '',
        email: '',
        message: '',
        product_interest: 'General Inquiry',
      });
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-body py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-16">
          <span className="text-gold-600 font-bold uppercase tracking-widest text-xs">Get in Touch</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-wide text-dark mt-2 mb-4">
            Contact Siddu Potadar
          </h1>
          <div className="w-16 h-[2px] bg-gold-500 mx-auto" />
        </ScrollReveal>

        {/* ─── TWO COLUMN CONTACT AREA ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-10 lg:p-12 mb-16">
          
          {/* Column 1: Contact Form (Left) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-dark mb-2">Send Us an Inquiry</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Have a question about a particular jewelry piece, custom orders, or current gold/silver rates? Leave us a message.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded-md py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter contact number"
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded-md py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full bg-gray-50 border border-gray-200 text-dark rounded-md py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Message / Inquiry Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your ornament requirements or query..."
                  className="w-full bg-gray-50 border border-gray-200 text-dark rounded-md py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-bold text-xs uppercase tracking-wider py-4 px-6 rounded transition-all duration-300 shadow-md shadow-gold-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : (
                  <>
                    Send Inquiry <FiSend className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Column 2: Information Blocks (Right) */}
          <div className="lg:col-span-5 space-y-8 bg-gray-50/50 p-6 sm:p-8 rounded-lg border border-gray-100 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-dark pb-2 border-b border-gray-200">
                Contact Information
              </h3>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5 shadow-sm">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dark uppercase tracking-wider mb-1">Showroom Address</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Belgaum Rd, Gajabarwadi, Hukkeri, Karnataka 591309, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5 shadow-sm">
                  <FiPhone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dark uppercase tracking-wider mb-1">Store Helpline</h4>
                  <a href="tel:+918971012999" className="text-xs text-gray-600 hover:text-gold-600 font-semibold transition-colors">
                    +91 89710 12999
                  </a>
                  <p className="text-[10px] text-gray-400">Available during business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5 shadow-sm">
                  <FiMail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dark uppercase tracking-wider mb-1">Email Inquiry</h4>
                  <a href="mailto:info@siddupotadar.com" className="text-xs text-gray-600 hover:text-gold-600 font-semibold transition-colors">
                    info@siddupotadar.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gold-600 flex-shrink-0 mt-0.5 shadow-sm">
                  <FiClock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dark uppercase tracking-wider mb-1">Business Hours</h4>
                  <p className="text-xs text-gray-500">Monday to Saturday</p>
                  <p className="text-xs text-gold-600 font-bold">10:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action Card */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <a
                href="https://wa.me/919019777333"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10"
              >
                <FaWhatsapp className="w-5 h-5" /> Live Chat on WhatsApp
              </a>
            </div>

          </div>
        </div>

        {/* ─── 3. GOOGLE MAPS EMBED ───────────────────────────────────────── */}
        <ScrollReveal direction="up" className="rounded-lg overflow-hidden shadow-sm border border-gray-100 h-96 bg-white">
          <iframe
            title="Siddu Potadar Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3831.0!2d74.6!3d16.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDEyJzAwLjAiTiA3NMKwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </ScrollReveal>

      </div>
    </div>
  );
};

export default Contact;
