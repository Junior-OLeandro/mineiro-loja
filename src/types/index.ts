export interface ProductPrice {
  simples: number;
  duplo: number;
  triplo: number;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  price?: number;
  prices?: ProductPrice;
  available?: boolean;
  extraIds?: string[];
  hasMeatChoice?: boolean;
  hasMeatPoint?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface Neighborhood {

  name: string;
  deliveryFee: number;
}

export interface CartItemExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  extras: CartItemExtra[];
  observation?: string;
  variant?: "simples" | "duplo" | "triplo";
  meat?: "boi" | "frango";
  meatPoint?: "malpassado" | "ao-ponto" | "bem-passado";
}

export type PaymentMethod = "pix" | "cash" | "card";

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  neighborhoodId: string;
  complement?: string;
}

export interface OrderData {
  customer: CustomerData;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  changeFor?: number;
  observation?: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
}

