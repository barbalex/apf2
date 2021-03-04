import React, { lazy } from 'react'
/**
 * do not load Karte on server
 * because leaflet and proj4 call windows
 * see: https://github.com/PaulLeCam/react-leaflet/issues/45#issuecomment-257712370
 *
 */
const Karte = lazy(() => import('./Karte'))

const KarteOrNull = ({ treeName }) => {
  if (typeof window === 'undefined') return null

  return <Karte treeName={treeName} />
}

export default KarteOrNull
