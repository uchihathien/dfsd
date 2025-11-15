// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: false,
    experimental: {
        serverSourceMaps: false, // 🟢 FIX LỖI
    }
};

module.exports = nextConfig;
