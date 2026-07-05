export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  weight: string;
  purity: string;
  price: number | null;
  show_price: boolean;
  show_purity: boolean;
  availability: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  product_count?: number;
}

export interface Inquiry {
  id: number;
  customer_name: string;
  phone: string;
  email: string;
  product_interest: string;
  message: string;
  status: string;
  created_at: string;
}

export interface Settings {
  shop_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  google_maps_url: string;
  whatsapp_number: string;
  business_hours: string;
  about_text: string;
  hero_title: string;
  hero_subtitle: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalInquiries: number;
  newInquiries: number;
  featuredProducts: number;
  recentProducts: Product[];
}
