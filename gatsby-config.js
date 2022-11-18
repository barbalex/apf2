module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/technischeDoku`,
        name: 'technischeDoku-pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/benutzerDoku`,
        name: 'benutzerDoku-pages',
      },
    },
    'gatsby-plugin-image',
    { resolve: 'gatsby-plugin-sharp', options: { failOn: 'none' } },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: './src/utils/typography.js',
        omitGoogleFont: true,
      },
    },
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
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
        icon: 'src/images/ophr.png',
        // not using maskable icon as that can not be transparent
        // which looks hideous in browser
        //icon_options: {
        //  purpose: `any maskable`,
        //},
        include_favicon: true,
        lang: 'de-CH',
        orientation: 'portrait',
        description: 'Aktionspläne für Flora-Projekte',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        gfm: true,
        footnotes: false,
        excerpt_separator: '<!-- end -->',
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1500,
              wrapperStyle: 'margin-left: 0;',
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              offsetY: '64',
            },
          },
          {
            resolve: 'gatsby-remark-emojis',
            options: {
              // Deactivate the plugin globally (default: true)
              active: true,
              // Add a custom css class
              class: 'emoji-icon',
              // Select the size (available size: 16, 24, 32, 64)
              size: 32,
              // Add custom styles
              styles: {
                display: 'inline',
                margin: '0',
                'margin-top': '-3px',
                position: 'relative',
                top: '3px',
                width: '20px',
              },
            },
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_self',
              rel: 'nofollow',
            },
          },
          {
            resolve: 'gatsby-remark-embed-video',
            options: {
              width: 300,
              // ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
              // height: 400, // Optional: Overrides optional.ratio
              related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
              noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
            },
          },
          {
            resolve: 'gatsby-remark-images-medium-zoom',
            options: {
              background: 'rgba(128,128,128,0.5)',
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-numbered-footnotes',
        ],
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-workerize-loader',
  ],
}
