import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import App from './App.jsx'

// https://vite-pwa-org.netlify.app/guide/auto-update.html
registerSW({ immediate: true })

console.log('main rendering')

ReactDOM.createRoot(document.getElementById('root'))
  // todo: causes mstPersist to run twice
  // .render(
  //   <React.StrictMode>
  //     <App />
  //   </React.StrictMode>,
  // )
  .render(<App />)
