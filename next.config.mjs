/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Fix for multiple lockfiles warning
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
