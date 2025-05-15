import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Memory wall',
    short_name: 'Memory wall',
    description: 'Mur en mémoire des soldats de la deuxième guerre mondiale.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1c1c1c',
    theme_color: '#F5BA00',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}