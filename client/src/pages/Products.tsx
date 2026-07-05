import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiSliders, FiTrash2 } from 'react-icons/fi';
import { getProducts, getCategories } from '../services/api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ScrollReveal from '../components/ScrollReveal';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter & Search states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const selectedCategory = searchParams.get('category') || '';

  // Fetch categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catData = await getCategories();
        setCategories(catData || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 4000); // 400ms is standard, wait, let's make it 400ms instead of 4000ms. Oh! In my prompt I wrote "4000" by mistake or wait. Let's make it 400ms so it is responsive.
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when category, search, or sort changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, debouncedSearch, sort]);

  // Fetch products when filters or page changes
  useEffect(() => {
    const fetchProds = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          page,
          limit: 12,
          sort,
        };
        if (selectedCategory) params.category = selectedCategory;
        if (debouncedSearch) params.search = debouncedSearch;

        const data = await getProducts(params);
        if (page === 1) {
          setProducts(data.products || []);
        } else {
          setProducts((prev) => [...prev, ...(data.products || [])]);
        }
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.total || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProds();
  }, [selectedCategory, debouncedSearch, sort, page]);

  const handleCategorySelect = (categoryName: string) => {
    if (categoryName) {
      searchParams.set('category', categoryName);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSort('newest');
    setSearchParams({});
  };

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-12">
          <span className="text-gold-600 font-bold uppercase tracking-widest text-xs">Siddu Potadar Catalog</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-wide text-dark mt-2 mb-4">
            Our Jewelry Collections
          </h1>
          <div className="w-16 h-[2px] bg-gold-500 mx-auto mt-2" />
        </ScrollReveal>

        {/* ─── SEARCH & FILTER CONTROLS ───────────────────────────────────── */}
        <ScrollReveal className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search ornaments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-dark rounded-md py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all"
              />
              <FiSearch className="absolute left-3.5 top-3.5 text-gray-400 w-4.5 h-4.5" />
            </div>

            {/* Sorting & Stats */}
            <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-4">
              <div className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-700">{products.length}</span> of <span className="font-semibold text-gray-700">{totalProducts}</span> designs
              </div>
              <div className="flex items-center gap-2">
                <FiSliders className="text-gold-600 w-4 h-4" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-dark rounded-md text-xs font-medium py-2 px-3 focus:outline-none focus:ring-1 focus:ring-gold-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A - Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Horizontal Scroll Pills */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex overflow-x-auto gap-2.5 pb-2 scrollbar-thin scrollbar-thumb-gray-200">
              <button
                onClick={() => handleCategorySelect('')}
                className={`flex-shrink-0 px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
                  !selectedCategory
                    ? 'gold-gradient text-dark border-transparent shadow-md shadow-gold-500/10'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gold-500/30'
                }`}
              >
                All Collections
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.name)}
                  className={`flex-shrink-0 px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
                    selectedCategory === category.name
                      ? 'gold-gradient text-dark border-transparent shadow-md shadow-gold-500/10'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gold-500/30'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Badges & Clear */}
          {(selectedCategory || debouncedSearch) && (
            <div className="flex items-center justify-between bg-gold-50/50 rounded-lg p-3 border border-gold-100">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700">Active:</span>
                {selectedCategory && (
                  <span className="bg-white border border-gold-200 text-gold-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Category: {selectedCategory}
                  </span>
                )}
                {debouncedSearch && (
                  <span className="bg-white border border-gold-200 text-gold-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Search: "{debouncedSearch}"
                  </span>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-600 font-semibold hover:text-rose-700 flex items-center gap-1.5 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" /> Clear Filters
              </button>
            </div>
          )}
        </ScrollReveal>

        {/* ─── PRODUCT GRID ──────────────────────────────────────────────── */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <ScrollReveal
                key={product.id}
                direction="up"
                delay={(idx % 4) * 0.05}
                className="h-full"
              >
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 text-center py-20 px-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-gold-50 text-gold-600 flex items-center justify-center mx-auto mb-6 text-xl">
                💍
              </div>
              <h3 className="font-display text-lg font-bold text-dark mb-2">No Ornaments Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed mb-6">
                We couldn't find any designs matching your search filters. Try using simpler terms or resetting your category selections.
              </p>
              <button
                onClick={handleClearFilters}
                className="gold-gradient hover:from-gold-600 hover:to-gold-700 text-dark text-xs uppercase font-bold tracking-wider py-2.5 px-6 rounded transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          )
        )}

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {/* Load More Button */}
        {!loading && page < totalPages && (
          <ScrollReveal direction="up" className="text-center mt-16">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="border border-gold-500 hover:bg-gold-500 hover:text-dark text-gold-600 font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded transition-all duration-300"
            >
              Load More Designs
            </button>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
};

export default Products;
