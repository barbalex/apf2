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
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       reactDatepicker: ['react-datepicker'],
    //     },
    //   },
    // },
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
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
    VitePWA({
      // workbox: {
      //   sourcemap: true,
      // },
      registerType: 'autoUpdate',
      includeAssets: [
        'src/images/favicon_package/apple-touch-icon.png',
        'src/images/favicon_package/favicon-32x32.png',
        'src/images/favicon_package/favicon-16x16.png',
        'src/images/favicon_package/safari-pinned-tab.svg',
        // 'src/images/ophr_256.png',
        'src/images/maskable_icon_x512.png',
        'src/images/maskable_icon_x192.png',
        'robots.txt',
        // 'src/images/ophr_512.png',
      ],
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
        background_color: '#2e7d32',
        theme_color: '#2e7d32',
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
