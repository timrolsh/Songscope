/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {protocol: "https", hostname: "localhost"},
            {protocol: "https", hostname: "res.cloudinary.com"},
            {protocol: "https", hostname: "media.pitchfork.com"},
            {protocol: "https", hostname: "t4.ftcdn.net"},
            {protocol: "https", hostname: "i.scdn.co"}
        ]
    }
};

export default nextConfig;
