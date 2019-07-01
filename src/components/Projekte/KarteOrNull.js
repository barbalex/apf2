import React, { useState } from 'react'

/**
 * do not load Karte on server
 * because leaflet calls windows
 * see: https://github.com/PaulLeCam/react-leaflet/issues/45#issuecomment-257712370
 */
export default ({ treeName }) => {
  const [Karte, setKarte] = useState(null)

  if (typeof window === 'undefined') return null

  import('./Karte').then(module => setKarte(module.default))

  if (!Karte) return null
  return <Karte treeName={treeName} />
}
