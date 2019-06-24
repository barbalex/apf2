import React from 'react'

import Karte from './Karte'

/**
 * ReactDOMServer does not yet support Suspense
 */

export default ({ treeName }) => {
  if (typeof window === 'undefined') return null
  return <Karte treeName={treeName} />
}
