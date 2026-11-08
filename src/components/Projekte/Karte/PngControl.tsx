import { useSetAtom } from 'jotai'
import { useMap } from 'react-leaflet'
import { MdGetApp } from 'react-icons/md'
import { saveAs } from 'file-saver'

import { captureMap } from './mapExport.ts'

import { setMapHideControlsAtom } from '../../../store/index.ts'

import styles from './FullscreenControl.module.css'

export const PngControl = () => {
  const setHideMapControls = useSetAtom(setMapHideControlsAtom)
  const map = useMap()

  const savePng = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setHideMapControls(true)
    try {
      const dataUrl = await captureMap(map)
      saveAs(dataUrl, 'apfloraKarte.png')
    } finally {
      setHideMapControls(false)
    }
  }

  return (
    <button
      onClick={(event) => void savePng(event)}
      title="Karte als png speichern"
      className={styles.button}
    >
      <MdGetApp />
    </button>
  )
}
