import React, { useState, useEffect } from 'react';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../services/api';
import { Category } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiPlus, FiEdit, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

const AdminCategories: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const fetchCats = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      showError('Failed to fetch categories list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showError('Category name is required.');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        showSuccess('Category updated.');
      } else {
        await createCategory(formData);
        showSuccess('Category created successfully!');
      }
      setIsModalOpen(false);
      fetchCats();
    } catch (err) {
      showError('Failed to save category.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Delete this category? Products currently mapped to this category name will remain, but the filter selection will be deleted.')) return;
    
    try {
      await deleteCategory(id);
      showSuccess('Category deleted.');
      fetchCats();
    } catch (err) {
      showError('Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6 font-body">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-dark">
            Category Settings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure catalog sections, description summaries, and view product mappings.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-bold text-xs uppercase tracking-wider py-3 px-5 rounded flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 transition-all duration-300"
        >
          <FiPlus /> Create Category
        </button>
      </div>

      {/* ─── CATEGORY TABLE ──────────────────────────────────────────────── */}
      {loading ? (
        <LoadingSpinner />
      ) : categories.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">Description Statement</th>
                  <th className="px-6 py-4">Mapped Designs Count</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-dark">{cat.name}</td>
                    <td className="px-6 py-4 max-w-sm truncate">{cat.description || 'No description provided.'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold-50 text-gold-700 border border-gold-200/50">
                        {cat.product_count ?? 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-gray-500 hover:text-gold-600 bg-gray-50 hover:bg-gold-50/50 border border-gray-200 rounded transition-colors"
                        >
                          <FiEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
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
          <div className="text-4xl mb-4">📁</div>
          <h3 className="font-display text-lg font-bold text-dark mb-1">No Categories Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
            Create catalog category lists to allow customers to filter products easily.
          </p>
          <button
            onClick={openAddModal}
            className="gold-gradient text-dark font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded shadow-md"
          >
            Create First Category
          </button>
        </div>
      )}

      {/* ─── ADD/EDIT CATEGORY MODAL ────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-2xl max-w-md w-full">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-display text-lg font-bold text-dark">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-dark"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Bridal Necklaces"
                  className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Category Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Explain ornament styles or purities mapped inside this category..."
                  className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2.5 px-3 text-xs focus:outline-none"
                ></textarea>
              </div>

              {/* Submit Actions */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded flex items-center gap-1.5 shadow"
                >
                  <FiCheck className="w-4 h-4" /> Save Category
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCategories;
