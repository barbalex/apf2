import React, { useEffect } from 'react'
import 'leaflet'
import 'leaflet-easyprint'
import { withLeaflet } from 'react-leaflet'

const options = {
  title: 'drucken',
  position: 'topright',
  filename: 'apfloraKarte',
  sizeModes: ['Current', 'A4Portrait', 'A4Landscape'],
  tileWait: 2000,
}
const style = { display: 'none' }

const PrintControl = ({ leaflet }) => {
  useEffect(() => {
    window.L.easyPrint(options).addTo(leaflet.map)
  }, [])

  return <div style={style} />
}

export default withLeaflet(PrintControl)
