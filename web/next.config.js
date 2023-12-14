/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            "^https://localhost/",
            "^https://res.cloudinary.com/",
            "^https://media.pitchfork.com/",
            "^https://t4.ftcdn.net/"
        ]
    }
};

module.exports = nextConfig;
