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
    chunkSizeWarningLimit: 600,
    // Exclude on-demand-only chunks from <link rel="modulepreload"> hints
    // so they aren't fetched at page load. They will still load on demand
    // when their dynamic import runs.
    modulePreload: {
      polyfill: true,
      resolveDependencies: (filename, deps) => {
        return deps.filter(
          (d) =>
            !d.includes("vendor-html2pdf") &&
            !d.includes("vendor-charts") &&
            !d.includes("vendor-chess") &&
            !d.includes("vendor-qrcode") &&
            !d.includes("page-admin") &&
            !d.includes("page-teacher") &&
            !d.includes("page-parent") &&
            !d.includes("data-"),
        );
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor libraries are split by package so we get long-lived
          // immutable caches per dependency.
          //
          // IMPORTANT: react and react-dom must live in the SAME chunk to
          // avoid circular initialization issues with libraries like
          // react-helmet-async / react-router that import from both.
          if (id.includes("node_modules")) {
            // Bucket 1: React core ecosystem (must stay together to avoid TDZ)
            if (
              id.includes("/react/") ||
              id.includes("react-dom") ||
              id.includes("react-router") ||
              id.includes("react-helmet") ||
              id.includes("scheduler") ||
              id.includes("/use-sync-external-store/")
            ) {
              return "vendor-react";
            }
            // Bucket 2: Firebase (split by sub-package since they're large)
            if (id.includes("firebase/firestore")) return "vendor-firestore";
            if (id.includes("firebase/auth")) return "vendor-firebase-auth";
            if (id.includes("firebase/analytics")) return "vendor-firebase-analytics";
            if (id.includes("firebase")) return "vendor-firebase";
            // Bucket 3: Charts (heavy, only used in dashboards)
            if (id.includes("recharts") || id.includes("d3-") || id.includes("victory-")) {
              return "vendor-charts";
            }
            // Bucket 4: PDF (huge, only used on demand)
            if (id.includes("html2pdf") || id.includes("jspdf") || id.includes("html2canvas")) {
              return "vendor-html2pdf";
            }
            // Bucket 5: QR code (only on school admin / kid login)
            if (id.includes("qrcode")) return "vendor-qrcode";
            // Bucket 6: Chess (only on board games)
            if (id.includes("chess.js")) return "vendor-chess";
            // Everything else lumped together - typically small utilities
            return "vendor-misc";
          }

          // App-side: split heavy data buckets and dashboards into their own
          // chunks so the initial route doesn't drag them in.
          //
          // Quiz question banks are huge (~100KB each); give every category
          // its own chunk so they load on demand only when their quiz mounts.
          if (id.includes("/src/components/quiz/data/")) {
            const m = id.match(/quiz\/data\/([^/]+)\.js/);
            if (m) return `data-${m[1].toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
            return "data-quiz-shared";
          }
          if (id.includes("/src/config/questions") || id.includes("Questions")) return "data-questions";
          if (id.includes("/src/services/")) return "app-services";
          if (id.includes("/src/contexts/")) return "app-contexts";
          if (id.includes("/src/components/admin/")) return "page-admin";
          if (id.includes("/src/components/teacher/")) return "page-teacher";
          if (id.includes("/src/components/parent/")) return "page-parent";
          if (id.includes("/src/components/rewards/")) return "feat-rewards";
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