import { useState, useEffect } from 'react'
import 'leaflet'
import { useMap } from 'react-leaflet'
import 'leaflet-easyprint'
import { MdGetApp } from 'react-icons/md'
import { useSetAtom } from 'jotai'
import type { Map as LeafletMap } from 'leaflet'

import { setMapHideControlsAtom } from '../../../store/index.ts'

import styles from './PngControl.module.css'

const options = {
  hidden: true,
  position: 'topright',
  exportOnly: true,
  filename: 'apfloraKarte',
  hideControlContainer: true,
}

interface EasyPrintControl {
  addTo: (map: LeafletMap) => EasyPrintControl
  remove: () => EasyPrintControl
  printMap: (sizeMode: string, filename: string) => void
}

// the leaflet-easyprint plugin registers L.easyPrint without typings
const easyPrint = (window.L as unknown as {
  easyPrint: (options: Record<string, unknown>) => EasyPrintControl
}).easyPrint

export const PngControl = () => {
  const setHideMapControls = useSetAtom(setMapHideControlsAtom)
  const map = useMap()
  const [printPlugin, setPrintPlugin] = useState<EasyPrintControl | undefined>()

  useEffect(() => {
    const pp = easyPrint(options)
    pp.addTo(map)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- stores the easyPrint instance for savePng
    setPrintPlugin(pp)

    return () => {
      pp.remove()
    }
  }, [map])

  useEffect(() => {
    const onEasyPrintFinished = () => setHideMapControls(false)

    map.on('easyPrint-finished', onEasyPrintFinished)

    return () => {
      map.off('easyPrint-finished', onEasyPrintFinished)
    }
  }, [map, setHideMapControls])

  const savePng = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setHideMapControls(true)
    printPlugin?.printMap('CurrentSize', 'apfloraKarte')
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
