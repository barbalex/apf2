import React, { useEffect } from 'react'
import 'leaflet'
import 'leaflet-easyprint'
import { useMap } from 'react-leaflet'

const options = {
  title: 'drucken',
  customWindowTitle: 'AP-Flora',
  position: 'topright',
  sizeModes: ['Current', 'A4Portrait', 'A4Landscape'],
  tileWait: 2000,
  defaultSizeTitles: {
    Current: 'Aktuelle Grösse',
    A4Landscape: 'A4 quer',
    A4Portrait: 'A4 hoch',
  },
  spinnerBgColor: '#2e7d32',
}
const style = { display: 'none' }

const PrintControl = () => {
  const map = useMap()

  useEffect(() => {
    window.L.easyPrint(options).addTo(map)
  }, [map])

  return <div style={style} />
}

export default PrintControl
