import axios from 'axios';
import type { Product, Category, Inquiry, Settings, DashboardStats } from '../types';

const api = axios.create({
  baseURL: '',
});

// Request interceptor – attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ─── Products ────────────────────────────────────────────────────────────────

export const getProducts = (params?: Record<string, any>) =>
  api.get<{ products: Product[]; total: number; page: number; totalPages: number }>('/api/products', { params }).then((res) => res.data);

export const getProduct = (id: number) =>
  api.get<Product>(`/api/products/${id}`).then((res) => res.data);

export const createProduct = (formData: FormData) =>
  api.post<Product>('/api/products', formData, {
    headers: { 'Content-Type': undefined as any },
  }).then((res) => res.data);

export const updateProduct = (id: number, formData: FormData) =>
  api.put<Product>(`/api/products/${id}`, formData, {
    headers: { 'Content-Type': undefined as any },
  }).then((res) => res.data);

export const deleteProduct = (id: number) =>
  api.delete(`/api/products/${id}`).then((res) => res.data);

export const deleteProductImage = (productId: number, imageId: number) =>
  api.delete(`/api/products/${productId}/images/${imageId}`).then((res) => res.data);

// ─── Categories ──────────────────────────────────────────────────────────────

export const getCategories = () =>
  api.get<Category[]>('/api/categories').then((res) => res.data);

export const createCategory = (data: { name: string; description: string }) =>
  api.post<Category>('/api/categories', data).then((res) => res.data);

export const updateCategory = (id: number, data: { name: string; description: string }) =>
  api.put<Category>(`/api/categories/${id}`, data).then((res) => res.data);

export const deleteCategory = (id: number) =>
  api.delete(`/api/categories/${id}`).then((res) => res.data);

// ─── Inquiries ───────────────────────────────────────────────────────────────

export const createInquiry = (data: Partial<Inquiry>) =>
  api.post('/api/inquiries', data).then((res) => res.data);

export const getInquiries = (params?: Record<string, any>) =>
  api.get('/api/inquiries', { params }).then((res) => res.data);

export const updateInquiry = (id: number, data: Partial<Inquiry>) =>
  api.put(`/api/inquiries/${id}`, data).then((res) => res.data);

export const deleteInquiry = (id: number) =>
  api.delete(`/api/inquiries/${id}`).then((res) => res.data);

// ─── Auth ────────────────────────────────────────────────────────────────────

export const login = (credentials: { username: string; password: string }) =>
  api.post('/api/auth/login', credentials).then((res) => res.data);

export const verifyToken = () =>
  api.get('/api/auth/verify').then((res) => res.data);

// ─── Settings ────────────────────────────────────────────────────────────────

export const getSettings = () =>
  api.get<Settings>('/api/settings').then((res) => res.data);

export const updateSettings = (data: Partial<Settings>) =>
  api.put<Settings>('/api/settings', data).then((res) => res.data);

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const getStats = () =>
  api.get<DashboardStats>('/api/products/stats/overview').then((res) => res.data);

export default api;
