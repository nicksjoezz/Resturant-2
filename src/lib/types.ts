// Shared, serializable types passed between server and client components.

export type MenuItemDTO = {
  id: string;
  name: string;
  description: string;
  nameFr: string;
  descriptionFr: string;
  price: number;
  image: string;
  tags: string[];
  cuisine: string;
  spicy: number;
  featured: boolean;
  available: boolean;
  prepMinutes: number;
  calories: number;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export type OrderType = 'DELIVERY' | 'PICKUP' | 'DINE_IN';
export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';
export type ReservationStatus = 'REQUESTED' | 'CONFIRMED' | 'SEATED' | 'CANCELLED';

export const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'PAID',
  'PREPARING',
  'READY',
  'COMPLETED',
  'CANCELLED',
];
export const RESERVATION_STATUSES: ReservationStatus[] = [
  'REQUESTED',
  'CONFIRMED',
  'SEATED',
  'CANCELLED',
];
