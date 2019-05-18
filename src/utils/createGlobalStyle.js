import { createGlobalStyle } from "styled-components"

export default () => createGlobalStyle`
  html,
  body,
  #___gatsby {
    overflow: hidden !important;
    font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    height: 100%;
    width: 100%;
    margin: 0;
    color: rgba(0,0,0,0.87);
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

    #___gatsby>div {
      height: auto !important;
      overflow: visible;
    }
  }

  a {
    color: black;
  }

.ReactVirtualized__Grid {
  outline: none;
}

  /* scrollbars */

  ::-webkit-scrollbar {
    width: 12px;
    background: rgba(255, 253, 231, 0.1);
  }

  ::-webkit-scrollbar:horizontal {
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 7px rgba(0, 0, 0, 0.4);
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    box-shadow: inset 0 0 7px rgba(0, 0, 0, 0.5);
    background: rgba(85, 85, 85, 0.05);
  }

  ::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0);
  }
`
