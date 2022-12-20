import React from 'react'
import { Global, css } from '@emotion/react'

const GlobalStyle = () => (
  <Global
    styles={css`
      html,
      body,
      #___gatsby {
        overflow: hidden !important;
        font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
        height: 100%;
        width: 100%;
        margin: 0;
        color: rgba(0, 0, 0, 0.87);
        background-color: #fffde7;
      }

      #gatsby-focus-wrapper {
        /* This div is added by reach-router: https://github.com/reach/router/issues/63 */
        height: 100%;
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

        #___gatsby {
          background-color: white !important;
          height: auto !important;
          min-height: auto !important;
          overflow: visible !important;
        }

        #___gatsby > div {
          height: auto !important;
          overflow: visible;
        }
      }

      a {
        color: black;
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

      /* uploadcare */
      .uploadcare--button {
        background-color: #2e7d32 !important;
        background: #2e7d32 !important;
        border: 1px solid #2e7d32 !important;
        color: white !important;
      }
      .uploadcare--button:focus {
        outline: 2px solid rgba(46, 125, 50, 0.5) !important;
      }
      .uploadcare--button:hover {
        background: rgba(46, 125, 50, 0.8) !important;
        border-color: rgba(46, 125, 50, 0.8) !important;
        color: white !important;
      }
      .uploadcare--widget__button,
      .uploadcare--widget__button:active,
      .uploadcare--widget__button:focus {
        background: none !important;
        color: black !important;
        border: 1px solid black !important;
        outline: none !important;
      }
      .uploadcare--widget__button,
      .uploadcare--widget__button:focus {
        color: #2e7d32 !important;
        font-size: 0.875rem !important;
        line-height: 24.5px !important;
        font-weight: 500 !important;
        border: 1px solid rgba(46, 125, 50, 0.5) !important;
        border-radius: 4px !important;
        padding: 5px 16px !important;
      }
      .uploadcare--widget__button:hover {
        color: #2e7d32 !important;
        font-size: 0.875rem !important;
        line-height: 24.5px !important;
        font-weight: 500 !important;
        border: 1px solid #2e7d32 !important;
        background-color: rgba(46, 125, 50, 0.08) !important;
      }
      .uploadcare--powered-by,
      .uploadcare--powered-by__link {
        display: none !important;
      }

      /* recharts */
      .recharts-legend-item {
        margin-bottom: 3px !important;
      }
    `}
  />
)

export default GlobalStyle
