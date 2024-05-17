/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {protocol: "https", hostname: "lh3.googleusercontent.com"},
            {protocol: "https", hostname: "i.scdn.co"},
            {protocol: "https", hostname: "localhost"}
        ]
    }
};

export default nextConfig;
