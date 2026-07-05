import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/api';
import { Settings } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiCheck, FiInfo } from 'react-icons/fi';

const AdminSettings: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Partial<Settings>>({
    shop_name: 'Siddu Potadar',
    tagline: 'Exquisite Gold & Silver Jewelry Since Generations',
    phone: '+91 90197 77333',
    email: 'info@siddupotadar.com',
    address: 'Belgaum Rd, Gajabarwadi, Hukkeri, Karnataka 591309, India',
    google_maps_url: '',
    whatsapp_number: '919019777333',
    business_hours: 'Monday to Saturday, 10:00 AM - 8:00 PM',
    about_text: '',
    hero_title: 'Timeless Elegance in Gold',
    hero_subtitle: 'Discover handcrafted gold and silver jewelry that celebrates tradition and modern design.',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        showError('Failed to load store settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settings);
      showSuccess('Store settings updated successfully!');
    } catch (err) {
      showError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 font-body">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-dark">
          Store Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Alters global shop headers, location links, phone numbers, and heritage about texts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        
        {/* SECTION 1: SHOP INFORMATION */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 p-6 space-y-5">
          <h2 className="font-display text-base font-bold text-dark border-b border-gray-100 pb-3 flex items-center gap-2">
            <FiInfo className="text-gold-500" /> Basic Shop Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-gray-600">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Shop Name
              </label>
              <input
                type="text"
                name="shop_name"
                value={settings.shop_name}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                About Heritage text
              </label>
              <textarea
                name="about_text"
                value={settings.about_text}
                onChange={handleChange}
                rows={6}
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT DETAILS */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 p-6 space-y-5">
          <h2 className="font-display text-base font-bold text-dark border-b border-gray-100 pb-3 flex items-center gap-2">
            🏪 Showroom & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-gray-600">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Helpline Phone
              </label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                WhatsApp Phone (Country Code prefix, e.g. 919019777333)
              </label>
              <input
                type="text"
                name="whatsapp_number"
                value={settings.whatsapp_number}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Helpline Email
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Showroom Business Hours
              </label>
              <input
                type="text"
                name="business_hours"
                value={settings.business_hours}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Physical Address
              </label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Google Map Embed URL (iframe source src parameter)
              </label>
              <input
                type="text"
                name="google_maps_url"
                value={settings.google_maps_url}
                onChange={handleChange}
                placeholder="https://www.google.com/maps/embed?..."
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: HERO DISPLAY */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 p-6 space-y-5">
          <h2 className="font-display text-base font-bold text-dark border-b border-gray-100 pb-3 flex items-center gap-2">
            ✨ Home Page Hero Banner Content
          </h2>

          <div className="grid grid-cols-1 gap-5 text-xs text-gray-600">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Hero Title Heading
              </label>
              <input
                type="text"
                name="hero_title"
                value={settings.hero_title}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Hero Subtitle Paragraph
              </label>
              <input
                type="text"
                name="hero_subtitle"
                value={settings.hero_subtitle}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={saving}
          className="gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-bold text-xs uppercase tracking-wider py-4 px-6 rounded transition-all duration-300 shadow-lg shadow-gold-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? 'Saving Settings...' : (
            <>
              Update Settings <FiCheck className="w-4 h-4" />
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default AdminSettings;
