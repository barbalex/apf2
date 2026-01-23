import { useState, useEffect } from 'react'
import 'leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet-easyprint'
import { MdGetApp } from 'react-icons/md'
import { useSetAtom } from 'jotai'

import { setMapHideControlsAtom } from '../../../store/index.ts'

import styles from './PngControl.module.css'

const options = {
  hidden: true,
  position: 'topright',
  exportOnly: true,
  filename: 'apfloraKarte',
  hideControlContainer: true,
}

export const PngControl = () => {
  const setHideMapControls = useSetAtom(setMapHideControlsAtom)
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
      className={styles.button}
    >
      <MdGetApp className={styles.icon} />
    </button>
  )
}
