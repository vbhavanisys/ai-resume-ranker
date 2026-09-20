import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

    export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'AI Resume Ranker',
        short_name: 'ResumeRanker',
        start_url: '/ai-resume-ranker/',
        scope: '/ai-resume-ranker/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#6366f1',
        icons: [
          { src: '/ai-resume-ranker/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/ai-resume-ranker/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
