/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: "loose",
        serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "res.cloudinary.com", port: "" },
        ],
    },
    output: "standalone",
};

module.exports = nextConfig;
