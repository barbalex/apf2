import { Global, css } from '@emotion/react'

export const GlobalStyle = () => (
  <Global
    styles={css`
      html,
      body,
      #root {
        overflow: hidden !important;
        font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
        height: 100dvh;
        width: 100%;
        margin: 0;
        color: rgba(0, 0, 0, 0.87);
        background-color: #fffde7;
        hyphens: auto;
      }

      @media print {
        * {
          overflow: visible !important;
        }
        html,
        body {
          background-color: white !important;
          height: auto !important;
          overflow: visible !important;
        }

        #root {
          background-color: white !important;
          height: auto !important;
          min-height: auto !important;
          overflow: visible !important;
        }

        #root > div {
          height: auto !important;
          overflow: visible;
        }
      }

      a {
        color: black;
      }

      // ensuring menus in more-menu have a a border
      // somehow the inmenu prop is not always passed in
      .menubar-more-menus button {
        border: 1px solid #ab9518 !important;
      }

      /* scrollbars */

      .simplebar-scrollbar:before {
        background: #2e7d32 !important;
      }
      /* hide native scrollbar */
      .simplebar-content-wrapper::-webkit-scrollbar {
        display: none;
      }

      /* newer syntax for firefox */
      // somehow scrollbar-width is seen at lower levels but not applied !!??
      html {
        scrollbar-color: #2e7d32#F2FEF3;
        scrollbar-width: thin;
      }

      /* own syntax for webkit */
      ::-webkit-scrollbar {
        width: 8px;
      }

      ::-webkit-scrollbar:horizontal {
        height: 8px;
      }

      ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        box-shadow: inset 0 0 7px #2e7d32;
        background: rgba(85, 85, 85, 0.05);
      }

      ::-webkit-scrollbar-corner {
        background: rgba(0, 0, 0, 0);
      }

      /* h3 in menu should only have a margin-top of 3 */
      .MuiMenu-list > h3 {
        margin-top: 3px;
      }

      /* uploadcare */
      .uploadcare button {
        background: transparent !important;
        color: rgb(46, 125, 50) !important;
        font-weight: 500 !important;
        border: 1px solid rgb(46, 125, 50) !important;
        border-radius: 4px !important;
      }
      .uploadcare uc-source-list button {
        color: oklch(0.21 0 0) !important;
        border: 1px solid oklch(0.92 0 0) !important;
      }
      .uploadcare button:hover {
        background: rgba(46, 125, 50, 0.05) !important;
        border-color: rgba(46, 125, 50, 0.9) !important;
        color: rgb(46, 125, 50) !important;
      }
      .uploadcare button:focus {
        outline: 2px solid rgba(46, 125, 50, 0.5) !important;
      }
      .uploadcare
        :where([uc-drop-area]):is(
          [drag-state='active'],
          [drag-state='near'],
          [drag-state='over'],
          :hover
        ) {
        color: rgb(46, 125, 50);
        background: rgba(46, 125, 50, 0.1);
        border-color: rgba(46, 125, 50, 0.1);
      }
      .uploadcare
        :where([uc-drop-area]):is(
          [drag-state='active'],
          [drag-state='near'],
          [drag-state='over'],
          :hover
        ) {
        color: rgb(46, 125, 50);
        background: rgba(46, 125, 50, 0.1);
        border-color: rgba(46, 125, 50, 0.1);
      }
      .uploadcare :where([uc-drop-area])[with-icon]:hover .uc-icon-container,
      :where([uc-drop-area])[with-icon]:hover .uc-text {
        color: rgb(46, 125, 50) !important;
      }

      /* recharts */
      .recharts-legend-item {
        margin-bottom: 3px !important;
      }

      /* leaflet */
      .leaflet-div-icon {
        background: transparent !important;
        border: none !important;
        width: 0;
        height: 0;
        border: 0;
        padding: 0;
      }
      .leaflet-div-icon svg {
        transform: translate(-25%, -25%);
      }
    `}
  />
)
