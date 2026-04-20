import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // output: 'standalone',
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'storage-sushitei.rapier.lyr.id'
      // }
    ]
  },

  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8'
          }
        ]
      }
    ]
  }
}

export default nextConfig
