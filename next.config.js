/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // recommended for Next.js
  swcMinify: true,       // faster minification
  experimental: {
    typedRoutes: false,  // keep as is if not using typed routes
  },
  images: {
    domains: ["ui-avatars.com", "lh3.googleusercontent.com"],
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000/api",
  },
  typescript: {
    // Warn instead of failing build on type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;