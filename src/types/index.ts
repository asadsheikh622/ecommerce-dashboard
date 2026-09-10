export type Currency = 'PKR' | 'USD';

export interface CurrencySettings {
  currency: Currency;
  exchangeRate: number; // 1 USD = X PKR (e.g. 280)
}

export type ProductStatus = 'Active' | 'Inactive' | 'Out of Stock';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  image: string;
  additionalImages?: string[];
  sellingPrice: number; // Stored internally in USD
  costPrice: number;    // Stored internally in USD
  stock: number;
  status: ProductStatus;
  featured: boolean;
  tags: string[];
  lastUpdated: string;
  isDeleted?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  parent?: string;
  status: 'Active' | 'Inactive';
  productsCount: number;
  sortOrder: number;
  isDeleted?: boolean;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  image: string;
  quantity: number;
  sellingPrice: number; // in USD
  costPrice: number;    // in USD
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #ORD-2026-1002
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    avatar?: string;
  };
  items: OrderItem[];
  subtotal: number;       // in USD
  deliveryCharges: number;// in USD
  discount: number;       // in USD
  refund: number;         // in USD
  total: number;          // in USD
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  date: string;
  notes?: string;
  timeline: {
    title: string;
    time: string;
    completed: boolean;
  }[];
}

export type UserStatus = 'Verified' | 'Unverified';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  avatar?: string;
  status: UserStatus;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number; // in USD
  isDeleted?: boolean;
}

export type ExpenseCategory =
  | 'Delivery'
  | 'Packaging'
  | 'Advertising'
  | 'Marketing'
  | 'Salaries'
  | 'Rent'
  | 'Electricity'
  | 'Internet'
  | 'Platform Fees'
  | 'Software'
  | 'Shipping'
  | 'Other';

export interface Expense {
  id: string;
  name: string;
  title?: string;
  category: ExpenseCategory;
  amount: number; // in USD
  date: string;
  description: string;
  paymentMethod: string;
  notes?: string;
  recurring?: boolean;
}

export interface StorefrontConfig {
  storeName: string;
  logoText?: string;
  tagline?: string;
  announcementBar?: {
    enabled: boolean;
    text: string;
  };
  announcement?: string;
  announcementEnabled?: boolean;
  hero?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    badge: string;
  };
  heroHeading?: string;
  heroSubtitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  featuredCategoryIds?: string[];
  banner?: {
    enabled: boolean;
    title: string;
    subtitle: string;
    discountText: string;
    buttonText: string;
  };
  footerText?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export type DatePresetKey =
  | 'custom'
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last28days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth';

export interface DateRangeState {
  preset: DatePresetKey;
  startDate: string; // ISO string 'YYYY-MM-DDTHH:mm:ss.sssZ'
  endDate: string;   // ISO string 'YYYY-MM-DDTHH:mm:ss.sssZ'
  label: string;     // e.g. "This Month", "Today", "01 Sep – 30 Sep 2026"
}

export type NotificationType =
  | 'new_order'
  | 'order_cancelled'
  | 'order_delivered'
  | 'low_stock'
  | 'out_of_stock'
  | 'new_customer'
  | 'payment_received';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  createdAt: string;
  orderNumber?: string;
  productId?: string;
}

