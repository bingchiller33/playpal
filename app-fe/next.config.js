/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose",
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
