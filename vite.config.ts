import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/ai-resume-ranker/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AI Resume Ranker',
        short_name: 'ResumeRanker',
        start_url: '/ai-resume-ranker/',
        scope: '/ai-resume-ranker/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#6366f1'
      }
    })
  ]
})
