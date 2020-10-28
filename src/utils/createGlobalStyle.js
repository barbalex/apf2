import { createGlobalStyle } from 'styled-components'

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

  /* scrollbars */

  .simplebar-scrollbar:before {
    background: #2e7d32 !important;
  }
  /* hide native scrollbar */
  .simplebar-content-wrapper::-webkit-scrollbar {
    display: none;
  }


  ::-webkit-scrollbar {
    width: 12px;
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

/* uploadcare */
.uploadcare--button {
  background-color: #2e7d32;
  background: #2e7d32;
  border: 1px solid #2e7d32;
  color: white;
}
.uploadcare--button:focus {
  color: #2e7d32;
  outline: 2px solid rgba(46, 125, 50,.5);
}
.uploadcare--button:hover {
  background: rgba(46, 125, 50,.8);
  border-color: rgba(46, 125, 50,.8);
  color: white;
}
.uploadcare--widget__button,
.uploadcare--widget__button:active,
.uploadcare--widget__button:focus {
  background:none;
  color: black;
  border: 1px solid black;
  outline: none;
}
.uploadcare--widget__button,
.uploadcare--widget__button:focus {
  color: #2e7d32;
  font-size: 0.875rem;
  line-height: 24.5px;
  font-weight: 500;
  border: 1px solid rgba(46, 125, 50, 0.5);
  border-radius: 4px;
  padding: 5px 16px;
}
.uploadcare--widget__button:hover {
  color: #2e7d32;
  font-size: 0.875rem;
  line-height: 24.5px;
  font-weight: 500;
  border: 1px solid #2e7d32;
  background-color: rgba(46, 125, 50, 0.08);
}
`
