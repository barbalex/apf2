import React, { useEffect, useState } from 'react'

/**
 * load not on server
 * see: https://github.com/PaulLeCam/react-leaflet/issues/45#issuecomment-257712370
 */
export default ({ treeName }) => {
  const [Karte, setKarte] = useState(null)
  useEffect(() => {
    setKarte(require('./Karte'))
  }, [])

  if (typeof window === 'undefined') return null

  return <Karte treeName={treeName} />
}
