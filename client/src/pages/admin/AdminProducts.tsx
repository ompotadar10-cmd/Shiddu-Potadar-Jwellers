import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  getProducts, 
  getCategories, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  deleteProductImage 
} from '../../services/api';
import { Product, Category } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  FiSearch, FiPlus, FiEdit, FiTrash2, 
  FiUploadCloud, FiX, FiCheck, FiStar, FiCamera
} from 'react-icons/fi';

const AdminProducts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useNotification();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Sort & Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formFiles, setFormFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    weight: '',
    purity: '22K',
    price: '',
    show_price: false,
    show_purity: true,
    availability: 'in_stock',
    featured: false,
  });

  // Camera Integration State
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      showError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setFormFiles((prev) => [...prev, file]);
            setImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
            showSuccess('Photo captured!');
          }
          stopCamera();
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const closeModal = () => {
    stopCamera();
    setIsModalOpen(false);
  };

  // Check URL triggers (like redirect from quick actions)
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openAddModal();
      // Remove query param to prevent reopen on refresh
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  // Fetch initial products & categories list
  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        limit: 10,
        search,
      };
      if (categoryFilter) params.category = categoryFilter;

      const data = await getProducts(params);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showError('Failed to load products list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats || []);
        if (cats && cats.length > 0) {
          setFormData((prev) => ({ ...prev, category: cats[0].name }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchProductsList();
  }, [page, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProductsList();
  };

  // Open modals
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[0]?.name || 'Gold Chains',
      description: '',
      weight: '',
      purity: '22K',
      price: '',
      show_price: false,
      show_purity: true,
      availability: 'in_stock',
      featured: false,
    });
    setFormFiles([]);
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      weight: product.weight,
      purity: product.purity,
      price: product.price ? product.price.toString() : '',
      show_price: product.show_price,
      show_purity: product.show_purity !== undefined ? product.show_purity : true,
      availability: product.availability,
      featured: product.featured,
    });
    setFormFiles([]);
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  // Handle Form Inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle Multiple File Selection & Previews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormFiles((prev) => [...prev, ...filesArray]);

      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previewUrls]);
    }
  };

  const handleRemoveFormFile = (index: number) => {
    setFormFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete product image database record
  const handleDeleteExistingImage = async (imgId: number) => {
    if (!editingProduct) return;
    if (!window.confirm('Delete this product image? This cannot be undone.')) return;
    
    try {
      await deleteProductImage(editingProduct.id, imgId);
      showSuccess('Image deleted.');
      
      // Update local state in editing product
      const updatedImages = editingProduct.images.filter((img) => img.id !== imgId);
      setEditingProduct({ ...editingProduct, images: updatedImages });
      setProducts((prev) => 
        prev.map((p) => p.id === editingProduct.id ? { ...p, images: updatedImages } : p)
      );
    } catch (err) {
      showError('Failed to delete image.');
    }
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      showError('Name and Category are required.');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('category', formData.category);
    payload.append('description', formData.description);
    payload.append('weight', formData.weight);
    payload.append('purity', formData.purity);
    payload.append('price', formData.price);
    payload.append('show_price', formData.show_price ? '1' : '0');
    payload.append('show_purity', formData.show_purity ? '1' : '0');
    payload.append('availability', formData.availability);
    payload.append('featured', formData.featured ? '1' : '0');

    // Append upload files
    formFiles.forEach((file) => {
      payload.append('images', file);
    });

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showSuccess('Product updated successfully!');
      } else {
        await createProduct(payload);
        showSuccess('Product created successfully!');
      }
      closeModal();
      fetchProductsList();
    } catch (err) {
      showError('Failed to save product design.');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this jewelry design? All images will be deleted.')) return;
    
    try {
      await deleteProduct(id);
      showSuccess('Product deleted.');
      fetchProductsList();
    } catch (err) {
      showError('Failed to delete product.');
    }
  };

  return (
    <div className="space-y-6 font-body">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-dark">
            Inventory Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, edit, search and delete your jewelry items catalog.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-bold text-xs uppercase tracking-wider py-3 px-5 rounded flex items-center justify-center gap-2 shadow-lg shadow-gold-500/10 transition-all duration-300"
        >
          <FiPlus /> Add Product Design
        </button>
      </div>

      {/* ─── FILTERS & SEARCH ROW ────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search catalog designs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-dark rounded-md py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
        </form>

        {/* Filter Category */}
        <div className="flex w-full md:w-auto items-center justify-end gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="bg-gray-50 border border-gray-200 text-dark rounded-md text-xs font-semibold py-2 px-3 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── PRODUCTS TABLE ──────────────────────────────────────────────── */}
      {loading ? (
        <LoadingSpinner />
      ) : products.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Preview</th>
                  <th className="px-6 py-4">Design Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Weight</th>
                  <th className="px-6 py-4">Purity</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {products.map((prod) => {
                  const thumb = prod.images && prod.images.length > 0 ? prod.images[0].image_url : null;
                  return (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="w-10 h-10 rounded overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                          {thumb ? (
                            <img src={thumb} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-gold-600">💍</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-semibold text-dark">{prod.name}</td>
                      <td className="px-6 py-3">{prod.category}</td>
                      <td className="px-6 py-3 font-medium">{prod.weight || 'N/A'}</td>
                      <td className="px-6 py-3 font-medium">
                        {prod.show_purity ? (prod.purity || 'N/A') : '—'}
                      </td>
                      <td className="px-6 py-3">
                        {prod.featured ? (
                          <span className="inline-flex items-center justify-center p-1 rounded-full bg-gold-50 text-gold-600 border border-gold-200">
                            <FiStar className="fill-current w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-2 text-gray-500 hover:text-gold-600 bg-gray-50 hover:bg-gold-50/50 border border-gray-200 rounded transition-colors"
                          >
                            <FiEdit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 text-rose-600 hover:text-rose-700 bg-rose-50/40 hover:bg-rose-50 border border-rose-100 rounded transition-colors"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gray-400">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded text-[10px] font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded text-[10px] font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200/60 p-16 text-center">
          <div className="text-4xl mb-4">💎</div>
          <h3 className="font-display text-lg font-bold text-dark mb-1">No Designs Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
            Get started by adding jewelry items to your store inventory catalog.
          </p>
          <button
            onClick={openAddModal}
            className="gold-gradient text-dark font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded shadow-md"
          >
            Create First Product
          </button>
        </div>
      )}

      {/* ─── ADD/EDIT MULTIPART MODAL ────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="font-display text-lg font-bold text-dark">
                {editingProduct ? `Edit Jewelry: ${editingProduct.name}` : 'Add New Jewelry Design'}
              </h2>
              <button 
                onClick={closeModal} 
                className="text-gray-400 hover:text-dark"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
              {/* Row 1: Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Design Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Traditional Antique Necklace"
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Weight, Purity & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Weight (e.g. 25g, 8g)
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g. 24.5g"
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Purity / Grade
                  </label>
                  <input
                    type="text"
                    name="purity"
                    value={formData.purity}
                    onChange={handleInputChange}
                    placeholder="e.g. 22K, 925 Silver"
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Availability Status
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none"
                  >
                    <option value="in_stock">Ready (In Stock)</option>
                    <option value="made_to_order">Custom Order (Made to Order)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Price Setting & Visibility Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Price (₹ Indian Rupees)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 150000"
                    className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded p-2.5">
                  <input
                    type="checkbox"
                    id="show_price"
                    name="show_price"
                    checked={formData.show_price}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="show_price" className="text-[10px] font-bold text-gray-600 select-none cursor-pointer">
                    Show Price on Website
                  </label>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded p-2.5">
                  <input
                    type="checkbox"
                    id="show_purity"
                    name="show_purity"
                    checked={formData.show_purity}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="show_purity" className="text-[10px] font-bold text-gray-600 select-none cursor-pointer">
                    Show Purity on Website
                  </label>
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Item Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Detail craftsmanship, occasion, stone counts, design details..."
                  className="w-full bg-gray-50 border border-gray-200 text-dark rounded py-2 px-3 text-xs focus:outline-none"
                ></textarea>
              </div>

              {/* Toggle: Featured Product */}
              <div className="flex items-center gap-3 bg-gold-50/20 border border-gold-200/20 rounded p-4">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-gold-500 focus:ring-gold-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="text-xs font-bold text-gold-800 select-none">
                  🌟 Highlight as Featured Masterpiece on Home Page
                </label>
              </div>

              {/* Upload Multi Images Block */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-dark">
                  Product Image Gallery
                </h3>
                
                {/* Existing Images (Edit state only) */}
                {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 font-semibold block">Currently Uploaded:</span>
                    <div className="flex flex-wrap gap-3">
                      {editingProduct.images.map((img) => (
                        <div key={img.id} className="relative w-20 h-20 rounded border border-gray-200 bg-gray-50 overflow-hidden group">
                          <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingImage(img.id)}
                            className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiTrash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload drag drop zone / Camera view */}
                {showCamera ? (
                  <div className="relative border-2 border-dashed border-gold-400 rounded-lg p-4 flex flex-col items-center justify-center bg-dark text-white overflow-hidden min-h-[300px]">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full max-h-[240px] object-cover rounded bg-black"
                    ></video>
                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="bg-gold-500 hover:bg-gold-600 text-dark font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <FiCamera className="w-4 h-4" /> Capture Photo
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded border border-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100/50 transition-colors">
                    <FiUploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Drag and drop images here, or click to browse
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Supports JPG, PNG, WEBP (Max 5MB per file)
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white border border-gray-200 text-[10px] font-semibold tracking-wider uppercase py-2 px-4 rounded hover:bg-gray-50 transition-all shadow-sm flex items-center gap-1.5"
                      >
                        Select Images
                      </button>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="bg-white border border-gray-200 text-[10px] font-semibold tracking-wider uppercase py-2 px-4 rounded hover:bg-gray-50 transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <FiCamera className="w-3.5 h-3.5 text-gold-600" /> Open Camera
                      </button>
                    </div>
                  </div>
                )}

                {/* Selected Files Preview List */}
                {imagePreviews.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-emerald-600 font-semibold block">Pending Upload:</span>
                    <div className="flex flex-wrap gap-3">
                      {imagePreviews.map((url, idx) => (
                        <div key={url} className="relative w-20 h-20 rounded border border-gray-200 bg-gray-50 overflow-hidden">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveFormFile(idx)}
                            className="absolute top-1 right-1 bg-dark/80 text-white hover:bg-dark p-0.5 rounded-full"
                          >
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit / Cancel Actions */}
              <div className="border-t border-gray-100 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-white border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark font-bold text-xs uppercase tracking-wider py-3 px-5 rounded flex items-center gap-1.5 shadow"
                >
                  <FiCheck className="w-4 h-4" /> Save Design
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
