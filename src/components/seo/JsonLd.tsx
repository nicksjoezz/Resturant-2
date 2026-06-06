import { siteConfig, getBaseUrl, integrations } from '@/lib/config';

/** JSON-LD Restaurant structured data — feeds Google's Knowledge Panel / rich results. */
export default function JsonLd() {
  const base = getBaseUrl();
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: siteConfig.name,
    description: siteConfig.description,
    url: base,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    servesCuisine: siteConfig.cuisine,
    priceRange: siteConfig.priceRange,
    openingHours: siteConfig.hours,
    menu: `${base}/menu`,
    acceptsReservations: 'True',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '250 Hawtown Road',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1280',
    },
    ...(integrations.mapsEmbed ? { hasMap: integrations.mapsEmbed } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // Structured data is static + trusted — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
