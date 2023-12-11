/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost', 'res.cloudinary.com', 'media.pitchfork.com'],
    }
};

module.exports = nextConfig;
