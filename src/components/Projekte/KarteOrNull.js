import React from 'react'
import loadable from '@loadable/component'

/**
 * ReactDOMServer does not yet support Suspense
 */

export default ({ treeName }) => {
  if (typeof window === 'undefined') return null
  const Karte = loadable(() => import('./Karte'))
  return <Karte treeName={treeName} />
}
