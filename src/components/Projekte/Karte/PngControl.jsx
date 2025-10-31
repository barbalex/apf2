import { useState, useEffect, useContext } from 'react'
import 'leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet-easyprint'
import { MdGetApp } from 'react-icons/md'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.js'

import { icon, button } from './PngControl.module.css'

const options = {
  hidden: true,
  position: 'topright',
  exportOnly: true,
  filename: 'apfloraKarte',
  hideControlContainer: true,
}

export const PngControl = observer(() => {
  const { setHideMapControls } = useContext(MobxContext)
  const map = useMap()
  const [printPlugin, setPrintPlugin] = useState({})

  useEffect(() => {
    const pp = window.L.easyPrint(options)
    pp.addTo(map)
    setPrintPlugin(pp)

    return () => {
      pp.remove()
    }
  }, [map])

  const onEasyPrintFinished = () => setHideMapControls(false)

  useEffect(() => {
    map.on('easyPrint-finished', onEasyPrintFinished)

    return () => {
      map.off('easyPrint-finished', onEasyPrintFinished)
    }
  }, [map, setHideMapControls])

  const savePng = (event) => {
    event.preventDefault()
    setHideMapControls(true)
    printPlugin.printMap('CurrentSize', 'apfloraKarte')
  }

  return (
    <button
      onClick={savePng}
      title="Karte als png speichern"
      className={button}
    >
      <MdGetApp className={icon} />
    </button>
  )
})
