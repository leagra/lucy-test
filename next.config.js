/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "media.lucyinthesky.com",
            }
        ]
    }
}

module.exports = nextConfig
