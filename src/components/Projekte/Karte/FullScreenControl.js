import React, { useEffect } from 'react'
import 'leaflet'
import { useLeaflet } from 'react-leaflet'
// eslint-disable-next-line no-unused-vars
import leafletFullscreen from 'leaflet.fullscreen'

const options = {
  position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, defaut topleft
  title: 'Karte maximieren', // change the title of the button, default Full Screen
  titleCancel: 'Karte verkleinern', // change the title of the button when fullscreen is on, default Exit Full Screen
  content: null, // change the content of the button, can be HTML, default null
  forceSeparateButton: false, // force seperate button to detach from zoom buttons, default false
  forcePseudoFullscreen: false, // force use of pseudo full screen even if full screen API is available, default false
  fullscreenElement: false, // Dom element to render in full screen, false by default, fallback to map._container
}

const FullScreenControl = () => {
  const { map } = useLeaflet()
  useEffect(() => {
    if (typeof window === 'undefined') return
    const fullscreenControl = window.L.control.fullscreen(options)
    fullscreenControl.addTo(map)
  }, [])

  return <div style={{ display: 'none' }} />
}

export default FullScreenControl
