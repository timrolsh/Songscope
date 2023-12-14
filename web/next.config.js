/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost', 'res.cloudinary.com', 'media.pitchfork.com', 't4.ftcdn.net', 'i.scdn.co'],
    }
};

module.exports = nextConfig;
