import React, { useEffect } from 'react'
import 'leaflet'
import 'leaflet-easyprint'
import { useLeaflet } from 'react-leaflet'

const options = {
  title: 'drucken',
  position: 'topright',
  filename: 'apfloraKarte',
  sizeModes: ['Current', 'A4Portrait', 'A4Landscape'],
  tileWait: 2000,
}
const style = { display: 'none' }

const PrintControl = () => {
  const { map } = useLeaflet()
  useEffect(() => {
    typeof window !== 'undefined' && window.L.easyPrint(options).addTo(map)
  }, [map])

  return <div style={style} />
}

export default PrintControl
