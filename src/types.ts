export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: string;
  images: string[];
  video?: string;
  variants: {
    sizes: string[];
    colors: { name: string; hex: string }[];
    style?: string[];
  };
  description: string;
  fabric: string;
  stock: number;
  isTrending: boolean;
  isNew: boolean;
  isSeasonal: boolean;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpend: number;
  description: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  phone: string;
}

export interface Order {
  id: string;
  date: string;
  items: {
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
    selectedSize: string;
    selectedColor: { name: string; hex: string };
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Returned' | 'Refunding';
  trackingNumber?: string;
  address: Address;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  loyaltyPoints: number;
  referralCode: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
