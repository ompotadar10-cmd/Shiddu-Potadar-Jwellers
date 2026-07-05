import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiSend, FiArrowLeft, FiMapPin, FiPhone, FiCheckCircle } from 'react-icons/fi';
import { createInquiry, getCategories } from '../services/api';
import { Category } from '../types';
import { useNotification } from '../context/NotificationContext';
import ScrollReveal from '../components/ScrollReveal';

const Inquiry: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const notificationContext = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const initialProduct = searchParams.get('product') || '';
  const initialInterest = searchParams.get('interest') || '';

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    product_interest: initialInterest || 'Gold Chains',
    message: initialProduct ? `I am interested in inquiring about the design: "${initialProduct}".` : '',
  });

  // Fetch categories for product interest dropdown
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catData = await getCategories();
        setCategories(catData || []);
        if (catData && catData.length > 0 && !initialInterest) {
          setFormData((prev) => ({
            ...prev,
            product_interest: catData[0].name,
          }));
        }
      } catch (err) {
        console.error('Error fetching categories for dropdown:', err);
      }
    };
    fetchCats();
  }, [initialInterest]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.phone) {
      notificationContext.showError('Name and Phone number are required.');
      return;
    }

    setSubmitting(true);
    try {
      await createInquiry(formData);
      notificationContext.showSuccess('Inquiry submitted successfully!');
      setSubmitted(true);
    } catch (err: any) {
      notificationContext.showError(err.response?.data?.error || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen font-body flex items-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header (Back option) */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-gray-500 hover:text-gold-600 font-semibold flex items-center gap-1.5 transition-colors focus:outline-none"
          >
            <FiArrowLeft className="w-3.5 h-3.5" /> Back to previous page
          </button>
        </div>

        {submitted ? (
          /* Success State Card */
          <ScrollReveal className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 sm:p-12 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-10 h-10" />
            </div>
            <h2 className="font-display text-2xl font-bold text-dark mb-3">Inquiry Received</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Thank you, <strong className="text-dark">{formData.customer_name}</strong>. Your inquiry about <strong className="text-dark">{formData.product_interest}</strong> has been logged in our system. A store representative will call you shortly on <strong className="text-dark">{formData.phone}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/products')}
                className="gold-gradient text-dark font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded transition-all duration-300 shadow-md shadow-gold-500/10"
              >
                Back to Collection
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded transition-all duration-300"
              >
                Submit another inquiry
              </button>
            </div>
          </ScrollReveal>
        ) : (
          /* Inquiry Form Grid */
          <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Form Column */}
            <div className="p-6 sm:p-10 md:col-span-7 space-y-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-1">Make an Inquiry</h1>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Select your item interest and leave your contacts. We will fetch options and contact you details.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter contact number"
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Product Interest Category
                  </label>
                  <select
                    name="product_interest"
                    value={formData.product_interest}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Specific request / design references
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Type in any weights, purity levels or custom patterns desired..."
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded transition-all duration-300 shadow-md shadow-gold-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : (
                    <>
                      Submit Inquiry <FiSend className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Column */}
            <div className="bg-dark text-white p-6 sm:p-10 md:col-span-5 flex flex-col justify-between border-l border-gold-900/10">
              <div className="space-y-6">
                <span className="text-gold-500 uppercase tracking-widest text-[9px] font-bold">Siddu Potadar</span>
                <h3 className="font-display text-xl font-semibold">Store Showroom</h3>
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-gold-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Belgaum Rd, Gajabarwadi, Hukkeri, Karnataka 591309, India
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-gold-500 w-5 h-5 flex-shrink-0" />
                    <a href="tel:+918971012999" className="text-xs text-gray-400 hover:text-gold-400 transition-colors">
                      +91 89710 12999
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-gold-900/20 pt-6 mt-8">
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  We answer digital inquiries within 24 business hours. If urgent, click the floating green WhatsApp widget to chat directly.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Inquiry;
