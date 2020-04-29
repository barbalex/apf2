/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from 'react'
import localForage from 'localforage'

import App from './src/App'
import 'prismjs/themes/prism-solarizedlight.css'

/**
 * Am importing App because
 * need to pass App db state
 * as db needs to be created async
 */
export const wrapRootElement = ({ element }) => <App element={element} />

// https://github.com/gatsbyjs/gatsby/issues/9087#issuecomment-459105021
export const onServiceWorkerUpdateReady = () => {
  // clear local storage in case db structure was changed
  localForage.clear()
  if (
    window.confirm('apflora neu laden, um die neuste Version zu installieren?')
  ) {
    window.location.reload(true)
  }
}
