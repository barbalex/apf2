import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import svgrPlugin from 'vite-plugin-svgr'
import { splitVendorChunkPlugin } from 'vite'
// import emotionSwcPlugin from 'emotion-swc-plugin'

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
      // output: {
      //   manualChunks: {
      //     reactDatepicker: ['react-datepicker'],
      //   },
      // },
    },
  },
  // jsc: {
  //   experimental: {
  //     plugins: [
  //       [
  //         'emotion-swc-plugin',
  //         // {
  //         //   // default is true. It will be disabled when build type is production.
  //         //   sourceMap: boolean,
  //         //   // default is 'dev-only'.
  //         //   autoLabel: 'never' | 'dev-only' | 'always',
  //         //   // default is '[local]'.
  //         //   // Allowed values: `[local]` `[filename]` and `[dirname]`
  //         //   // This option only works when autoLabel is set to 'dev-only' or 'always'.
  //         //   // It allows you to define the format of the resulting label.
  //         //   // The format is defined via string where variable parts are enclosed in square brackets [].
  //         //   // For example labelFormat: "my-classname--[local]", where [local] will be replaced with the name of the variable the result is assigned to.
  //         //   labelFormat: string,
  //         // },
  //       ],
  //     ],
  //   },
  // },
  plugins: [
    splitVendorChunkPlugin(),
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
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
})
