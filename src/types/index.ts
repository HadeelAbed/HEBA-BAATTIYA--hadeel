export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"
  | "RETURNED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentMethod =
  | "VISA"
  | "MASTERCARD"
  | "MADA"
  | "APPLE_PAY"
  | "STC_PAY"
  | "CASH_ON_DELIVERY";
export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
export type Role = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductColor {
  id: string;
  name: string;
  hexCode: string;
}

export interface ProductSize {
  id: string;
  label: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  colorId?: string;
  sizeId?: string;
  stock: number;
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  isFeatured: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  fabricDetails?: string;
  careInstructions?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  status: ProductStatus;
  categoryId: string;
  category: Category;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  colors: ProductColor[];
  sizes: ProductSize[];
  images: ProductImage[];
  variants: ProductVariant[];
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  stockTotal: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface CartLine {
  id: string;
  productId: string;
  variantId?: string;
  product: Product;
  colorName?: string;
  sizeLabel?: string;
  quantity: number;
}

export interface WishlistLine {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface Address {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  line1: string;
  line2?: string;
  postalCode: string;
  isDefault: boolean;
}

export interface OrderItemLine {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  colorName?: string;
  sizeLabel?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  shipFullName: string;
  shipPhone: string;
  shipEmail: string;
  shipCountry: string;
  shipCity: string;
  shipLine1: string;
  shipLine2?: string;
  shipPostal: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  items: OrderItemLine[];
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  image?: string;
  role: Role;
  createdAt: string;
}
