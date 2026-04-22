// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/utils/**',
        'src/services/**',
        'src/hooks/**',
        'src/auth/guestTrial.js',
        'src/config/**',
        'src/contexts/**',
        'src/components/Navbar.jsx',
        'src/components/ErrorBoundary.jsx',
        'src/components/FooterSection.jsx',
        'src/components/SEO.jsx',
        'src/components/HeroSection.jsx',
        'src/components/FeaturesSection.jsx',
        'src/components/GameShowcase.jsx',
        'src/components/TestimonialsSection.jsx',
        'src/components/TryFreeSection.jsx',
        'src/components/SkeletonLoader.jsx',
        'src/components/SearchOverlay.jsx',
        'src/components/dashboard/StatCard.jsx',
        'src/components/rewards/**',
        'src/components/Sidebar/**',
        'src/components/ui/**',
        'src/pages/NotFoundPage.jsx',
      ],
      exclude: [
        'src/services/AIService.js',
        'src/services/SoundService.js',
        'src/services/NotificationService.js',
        'src/services/DigestService.js',
        'src/services/SyncService.js',
        'src/services/ApiService.js',
        'src/services/ProfileService.js',
        'src/utils/pdfExport.js',
      ],
      thresholds: {
        statements: 55,
        branches: 45,
        functions: 55,
        lines: 55,
      },
    },
  },
});