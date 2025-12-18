import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@rocode/ui', '@rocode/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tr.rbxcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'thumbnails.roblox.com',
      },
    ],
  },
}

export default nextConfig

