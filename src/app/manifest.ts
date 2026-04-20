import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/dashboard',
    name: 'Digital Twin',
    short_name: 'Digital Twin',
    description: 'Digital Twin - Smart Building Management System',
    start_url: '/dashboard',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/icons/icon-192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/icons/icon-512',
        sizes: '512x512',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Digital Twin Dashboard'
      },
      {
        src: '/icons/icon-512',
        sizes: '512x512',
        type: 'image/png',
        label: 'Digital Twin Mobile'
      }
    ]
  }
}
