import { Order, Address, CustomerUser } from "@/types";
import { products } from "./products";

export const mockUser: CustomerUser = {
  id: "user_001",
  name: "Layla Al-Rashid",
  firstName: "Layla",
  lastName: "Al-Rashid",
  email: "layla.alrashid@example.com",
  phone: "+966 50 123 4567",
  role: "CUSTOMER",
  createdAt: "2025-02-14T00:00:00.000Z",
};

export const mockAddresses: Address[] = [
  {
    id: "addr_001",
    label: "Home",
    fullName: "Layla Al-Rashid",
    phone: "+966 50 123 4567",
    country: "Saudi Arabia",
    city: "Jeddah",
    line1: "Al Hamra District, Tahlia Street, Villa 14",
    postalCode: "23434",
    isDefault: true,
  },
  {
    id: "addr_002",
    label: "Office",
    fullName: "Layla Al-Rashid",
    phone: "+966 50 123 4567",
    country: "Saudi Arabia",
    city: "Riyadh",
    line1: "King Fahd Road, Olaya Tower, Floor 12",
    postalCode: "11564",
    isDefault: false,
  },
];

function buildOrderItems(productIds: string[]) {
  return productIds.map((id, i) => {
    const p = products.find((prod) => prod.id === id)!;
    const qty = 1;
    return {
      id: `oi_${id}_${i}`,
      productId: p.id,
      productName: p.name,
      productImage: p.images[0]?.url,
      colorName: p.colors[0]?.name,
      sizeLabel: p.sizes[0]?.label,
      unitPrice: p.price,
      quantity: qty,
      lineTotal: p.price * qty,
    };
  });
}

export const mockOrders: Order[] = [
  {
    id: "order_001",
    orderNumber: "HB-2604-58213",
    status: "DELIVERED",
    paymentStatus: "PAID",
    paymentMethod: "MADA",
    subtotal: 8900,
    shippingCost: 0,
    taxAmount: 1335,
    discountAmount: 0,
    total: 10235,
    currency: "SAR",
    shipFullName: "Layla Al-Rashid",
    shipPhone: "+966 50 123 4567",
    shipEmail: "layla.alrashid@example.com",
    shipCountry: "Saudi Arabia",
    shipCity: "Jeddah",
    shipLine1: "Al Hamra District, Tahlia Street, Villa 14",
    shipPostal: "23434",
    trackingNumber: "SMSA-99238174",
    trackingCarrier: "SMSA Express",
    items: buildOrderItems(["prod_001"]),
    createdAt: "2026-04-12T10:00:00.000Z",
  },
  {
    id: "order_002",
    orderNumber: "HB-2605-41927",
    status: "SHIPPED",
    paymentStatus: "PAID",
    paymentMethod: "VISA",
    subtotal: 3400,
    shippingCost: 75,
    taxAmount: 521.25,
    discountAmount: 0,
    total: 3996.25,
    currency: "SAR",
    shipFullName: "Layla Al-Rashid",
    shipPhone: "+966 50 123 4567",
    shipEmail: "layla.alrashid@example.com",
    shipCountry: "Saudi Arabia",
    shipCity: "Riyadh",
    shipLine1: "King Fahd Road, Olaya Tower, Floor 12",
    shipPostal: "11564",
    trackingNumber: "ARAMEX-77129384",
    trackingCarrier: "Aramex",
    items: buildOrderItems(["prod_005"]),
    createdAt: "2026-05-30T14:20:00.000Z",
  },
  {
    id: "order_003",
    orderNumber: "HB-2606-30142",
    status: "PROCESSING",
    paymentStatus: "PAID",
    paymentMethod: "STC_PAY",
    subtotal: 6200,
    shippingCost: 0,
    taxAmount: 930,
    discountAmount: 620,
    total: 6510,
    currency: "SAR",
    shipFullName: "Layla Al-Rashid",
    shipPhone: "+966 50 123 4567",
    shipEmail: "layla.alrashid@example.com",
    shipCountry: "Saudi Arabia",
    shipCity: "Jeddah",
    shipLine1: "Al Hamra District, Tahlia Street, Villa 14",
    shipPostal: "23434",
    items: buildOrderItems(["prod_003"]),
    createdAt: "2026-06-20T09:15:00.000Z",
  },
];

export function getOrderByNumber(orderNumber: string) {
  return mockOrders.find((o) => o.orderNumber === orderNumber);
}

export const ORDER_TRACKING_STEPS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;
