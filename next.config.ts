import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'storage-sushitei.rapier.lyr.id'
      // }
    ]
  }
}

export default nextConfig
