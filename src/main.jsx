import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import App from './App'

// https://vite-plugin-pwa.netlify.app/guide/prompt-for-update.html#runtime
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
