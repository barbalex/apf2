import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import svgrPlugin from 'vite-plugin-svgr'
// activating the analyzer breaks the build on vercel
// import { analyzer } from 'vite-bundle-analyzer'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      // https://github.com/TanStack/query/issues/5175#issuecomment-1482196558
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
    },
  },
  plugins: [
    svgrPlugin({
      include: '**/*.svg', // https://github.com/pd4d10/vite-plugin-svgr/issues/91#issuecomment-1732028802
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
    // need to NOT use complete path to src/images
    // image files need to be in public instead
    // https://vitejs.dev/guide/assets.html
    VitePWA({
      workbox: {
        sourcemap: true,
        globPatterns: [
          '**/*.{js,jsx,ts,tsx,css,html,ico,png,jpg,svg,webp,json,woff2,woff}',
        ],
        maximumFileSizeToCacheInBytes: 1000000000,
      },
      registerType: 'autoUpdate',
      includeAssets: ['robots.txt'],
      // https://developer.mozilla.org/en-US/docs/Web/Manifest
      manifest: {
        scope: '.',
        name: 'apflora.ch',
        short_name: 'apflora',
        // https://web.dev/add-manifest/:
        // Your start_url should direct the user straight into your app,
        // rather than a product landing page.
        // Think about what the user will want to do once they open your app,
        // and place them there
        start_url: './Daten',
        background_color: '#256328',
        theme_color: '#256328',
        display: 'minimal-ui',
        icons: [
          {
            src: '/ophr_192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/maskable_icon_x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/ophr_512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        orientation: 'portrait',
        description: 'Aktionspläne für Flora-Projekte',
      },
      // devOptions: {
      //   enabled: true,
      // },
    }),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    // analyzer(),
  ],
  css: {
    modules: {
      // enable using named exports for css classes
      // https://vite.dev/guide/features.html#css-modules
      localsConvention: 'camelCaseOnly',
    },
  },
  // needed for electron to build an asar package
  resolve: {
    preserveSymlinks: true,
  },
})
