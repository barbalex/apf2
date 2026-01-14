import { useEffect, useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { FaExpandArrowsAlt, FaCompressArrowsAlt } from 'react-icons/fa'
import screenfull from 'screenfull'

import { MobxContext } from '../../../mobxContext.ts'

import styles from './FullscreenControl.module.css'

export const FullscreenControl = observer(({ mapRef }) => {
  // need to test if screenfull (i.e. the fullscreen api) is supported - iPhones don't support it
  // https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide
  const store = useContext(MobxContext)
  const { enqueNotification } = store

  if (!screenfull.isEnabled) {
    enqueNotification({
      message: `Ihr Browser unterstützt den Vollbildmodus nicht. Bitte verwenden Sie einen anderen Browser. Hinweis: iPhones unterstützen den Vollbildmodus grundsätzlich nicht - unabhängig vom verwendeten Browser.`,
      options: {
        variant: 'warning',
        autoHideDuration: 20000,
      },
    })
    return null
  }

  return <FullscreenController mapRef={mapRef} />
})

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
