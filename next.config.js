/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js + drei ship untranspiled ESM in places; let Next handle it.
  transpilePackages: ['three'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
  experimental: {
    // Helps with large three.js bundles during dev.
    optimizePackageImports: ['lucide-react', '@react-three/drei'],
  },
};

module.exports = nextConfig;
