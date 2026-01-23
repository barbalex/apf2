import { useEffect, useState } from 'react'
import { useSetAtom } from 'jotai'
import { FaExpandArrowsAlt, FaCompressArrowsAlt } from 'react-icons/fa'
import screenfull from 'screenfull'

import styles from './FullscreenControl.module.css'

import { addNotificationAtom } from '../../../JotaiStore/index.ts'

export const FullscreenControl = ({ mapRef }) => {
  const addNotification = useSetAtom(addNotificationAtom)
  // need to test if screenfull (i.e. the fullscreen api) is supported - iPhones don't support it
  // https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide
  if (!screenfull.isEnabled) {
    addNotification({
      message: `Ihr Browser unterstützt den Vollbildmodus nicht. Bitte verwenden Sie einen anderen Browser. Hinweis: iPhones unterstützen den Vollbildmodus grundsätzlich nicht - unabhängig vom verwendeten Browser.`,
      options: {
        variant: 'warning',
        autoHideDuration: 20000,
      },
    })
    return null
  }

  return <FullscreenController mapRef={mapRef} />
}

const FullscreenController = ({ mapRef }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const onFullscreenChange = () => setIsFullscreen(screenfull.isFullscreen)

  useEffect(() => {
    screenfull.on('change', onFullscreenChange)
    return () => screenfull.off('change', onFullscreenChange)
  }, [onFullscreenChange])

  const onClick = () =>
    screenfull.isEnabled && screenfull.toggle(mapRef.current)

  return (
    <button
      className={styles.button}
      onClick={onClick}
      title={isFullscreen ? 'Karte verkleinern' : 'Karte maximieren'}
    >
      {isFullscreen ?
        <FaCompressArrowsAlt />
      : <FaExpandArrowsAlt />}
    </button>
  )
}
