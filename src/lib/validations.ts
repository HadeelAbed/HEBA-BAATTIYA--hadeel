import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerFieldsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().optional(),
  agreeToTerms: z.boolean().optional(),
});

export const registerSchema = registerFieldsSchema
  .extend({
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to the Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  isDefault: z.boolean().optional(),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  paymentMethod: z.enum([
    "VISA",
    "MASTERCARD",
    "MADA",
    "APPLE_PAY",
    "STC_PAY",
    "CASH_ON_DELIVERY",
  ]),
  saveAddress: z.boolean().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().min(1, "Description is required"),
  fabricDetails: z.string().optional(),
  careInstructions: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  compareAtPrice: z.number().optional(),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
});

export const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().optional(),
  maxUses: z.number().optional(),
  expiresAt: z.string().optional(),
});
