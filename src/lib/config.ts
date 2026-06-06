// Central place to read public-facing integration config from env.
// NEXT_PUBLIC_* vars are inlined at build time and safe to read on the client.

export const siteConfig = {
  name: 'Foddo',
  tagline: 'Grab the best fine dining',
  description:
    'An immersive 3D dining experience. Explore the menu, reserve a table and order in a few clicks.',
  address: '250 Hawtown Road, New York, NY',
  phone: '+1 6666 9999 0000',
  email: 'hello@foddo.digital',
  geo: { lat: 40.7128, lng: -74.006 },
  hours: 'Mo-Su 11:00-23:00',
  priceRange: '$$$',
  cuisine: ['Signature', 'Japanese', 'Indian', 'Western'],
};

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

/** Public integration availability — used to show/hide UI gracefully. */
export const integrations = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL || '',
  mapsEmbed: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || '',
  reviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || '',
  paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  wiseLink: process.env.NEXT_PUBLIC_WISE_PAYMENT_LINK || '',
  stripe: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
};

export function whatsappLink(message: string) {
  const num = integrations.whatsapp.replace(/[^0-9]/g, '');
  if (!num) return '';
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}
