import React, { useState, useEffect } from 'react';
import { getInquiries, updateInquiry, deleteInquiry } from '../../services/api';
import { Inquiry } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiSearch, FiTrash2, FiX, FiCheck, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const AdminInquiries: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Selected Inquiry Drawer/Modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const fetchInquiriesList = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const data = await getInquiries(params);
      // Wait, let's verify if server response is array or object
      setInquiries(Array.isArray(data) ? data : data.inquiries || []);
    } catch (err) {
      showError('Failed to fetch customer inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiriesList();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiriesList();
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateInquiry(id, { status: newStatus });
      showSuccess(`Status updated to "${newStatus}"`);
      
      // Update local states
      setInquiries((prev) => 
        prev.map((inq) => inq.id === id ? { ...inq, status: newStatus } : inq)
      );
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (err) {
      showError('Failed to update status.');
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!window.confirm('Delete this customer inquiry record?')) return;

    try {
      await deleteInquiry(id);
      showSuccess('Inquiry deleted.');
      setSelectedInquiry(null);
      fetchInquiriesList();
    } catch (err) {
      showError('Failed to delete inquiry.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            New
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Contacted
          </span>
        );
      case 'closed':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-body">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-dark">
          Customer Inquiries
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review digital form submissions, mark contacted status, or remove logged queries.
        </p>
      </div>

      {/* ─── FILTERS & SEARCH ROW ────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search client name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-dark rounded-md py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
        </form>

        {/* Filter Status */}
        <div className="flex w-full md:w-auto items-center justify-end gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-dark rounded-md text-xs font-semibold py-2 px-3 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="new">New Only</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed / Solved</option>
          </select>
        </div>
      </div>

      {/* ─── INQUIRIES LIST TABLE ────────────────────────────────────────── */}
      {loading ? (
        <LoadingSpinner />
      ) : inquiries.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Phone / Contact</th>
                  <th className="px-6 py-4">Product Interest</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Received Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {inquiries.map((inq) => (
                  <tr 
                    key={inq.id} 
                    onClick={() => setSelectedInquiry(inq)}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-semibold text-dark">{inq.customer_name}</td>
                    <td className="px-6 py-4">{inq.phone}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded font-medium">
                        {inq.product_interest}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(inq.status)}</td>
                    <td className="px-6 py-4">
                      {new Date(inq.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-2">
                        {inq.status !== 'contacted' && inq.status !== 'closed' && (
                          <button
                            onClick={() => handleStatusChange(inq.id, 'contacted')}
                            title="Mark as Contacted"
                            className="p-2 text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded transition-colors"
                          >
                            <FiCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {inq.status !== 'closed' && (
                          <button
                            onClick={() => handleStatusChange(inq.id, 'closed')}
                            title="Mark as Closed"
                            className="p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded transition-colors"
                          >
                            <FiCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          title="Delete Record"
                          className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50/40 hover:bg-rose-50 border border-rose-100 rounded transition-colors"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-16 text-center border border-gray-200/60">
          <div className="text-4xl mb-4">📬</div>
          <h3 className="font-display text-lg font-bold text-dark mb-1">No Inquiries Logged</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Queries submitted via the public contact forms or WhatsApp trigger will display here.
          </p>
        </div>
      )}

      {/* ─── DETAIL DISPLAY MODAL/DRAWER ────────────────────────────────── */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-display text-lg font-bold text-dark">
                Inquiry Detail
              </h2>
              <button 
                onClick={() => setSelectedInquiry(null)} 
                className="text-gray-400 hover:text-dark"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 text-xs text-gray-600">
              {/* Client Info Block */}
              <div className="space-y-3 bg-gray-50 p-4 rounded border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-dark">{selectedInquiry.customer_name}</span>
                  {getStatusBadge(selectedInquiry.status)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-500 pt-2 border-t border-gray-200/50">
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-gold-600" />
                    <a href={`tel:${selectedInquiry.phone}`} className="hover:text-gold-600 transition-colors font-medium">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                  {selectedInquiry.email && (
                    <div className="flex items-center gap-2">
                      <FiMail className="text-gold-600" />
                      <a href={`mailto:${selectedInquiry.email}`} className="hover:text-gold-600 transition-colors font-medium">
                        {selectedInquiry.email}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 col-span-2">
                    <FiCalendar className="text-gold-600" />
                    <span>
                      Received: {new Date(selectedInquiry.created_at).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Interest Block */}
              <div className="space-y-1.5">
                <span className="block text-[10px] uppercase font-bold text-gray-400">Selected Product Category</span>
                <span className="bg-gold-50 border border-gold-200 text-gold-800 text-[11px] font-bold px-3 py-1 rounded inline-block">
                  {selectedInquiry.product_interest}
                </span>
              </div>

              {/* Message Details */}
              <div className="space-y-1.5">
                <span className="block text-[10px] uppercase font-bold text-gray-400">Customer Message</span>
                <div className="bg-gray-50/50 border border-gray-200 rounded p-4 text-dark leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message || 'No additional custom message details left.'}
                </div>
              </div>

              {/* Contact Client Actions */}
              <div className="space-y-2 border-t border-gray-100 pt-5">
                <span className="block text-[10px] uppercase font-bold text-gray-400">Direct Contact Options</span>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] uppercase tracking-wider py-3 px-4 rounded text-center flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
                  >
                    <FiPhone className="w-4 h-4" /> Call Client
                  </a>
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedInquiry.customer_name}, this is Siddu Potadar Jewellers responding to your inquiry about: ${selectedInquiry.product_interest}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[120px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider py-3 px-4 rounded text-center flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
                  >
                    <FaWhatsapp className="w-4 h-4" /> WhatsApp Chat
                  </a>
                  {selectedInquiry.email && (
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Siddu%20Potadar%20Jewellers%20-%20Inquiry%20Response&body=${encodeURIComponent(`Hello ${selectedInquiry.customer_name},\n\nWe received your inquiry regarding "${selectedInquiry.product_interest}".`)}`}
                      className="flex-1 min-w-[120px] bg-gray-600 hover:bg-gray-700 text-white font-bold text-[11px] uppercase tracking-wider py-3 px-4 rounded text-center flex items-center justify-center gap-2 transition-all duration-300 shadow-md"
                    >
                      <FiMail className="w-4 h-4" /> Email Client
                    </a>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-gray-100 pt-5 flex flex-wrap gap-2 items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                  className="text-rose-600 hover:text-rose-700 font-bold text-xs uppercase tracking-wider py-2 px-3 hover:bg-rose-50 rounded"
                >
                  Delete Record
                </button>
                <div className="flex gap-2">
                  {selectedInquiry.status !== 'contacted' && (
                    <button
                      onClick={() => handleStatusChange(selectedInquiry.id, 'contacted')}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs uppercase tracking-wider py-2 px-3 rounded"
                    >
                      Mark Contacted
                    </button>
                  )}
                  {selectedInquiry.status !== 'closed' && (
                    <button
                      onClick={() => handleStatusChange(selectedInquiry.id, 'closed')}
                      className="gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-bold text-xs uppercase tracking-wider py-2 px-3 rounded shadow"
                    >
                      Mark Solved / Closed
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminInquiries;
