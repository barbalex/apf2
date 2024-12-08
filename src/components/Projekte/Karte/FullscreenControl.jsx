import { useCallback, useEffect, useState, useContext } from 'react'
import styled from '@emotion/styled'
import { FaExpandArrowsAlt, FaCompressArrowsAlt } from 'react-icons/fa'
import screenfull from 'screenfull'

import { MobxContext } from '../../../storeContext.js'

const Button = styled.button`
  background-color: white;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-clip: padding-box;
  cursor: pointer;
  text-align: center;
  padding: 0 4px;
  svg {
    color: rgba(0, 0, 0, 0.8) !important;
    height: 30px;
  }
  margin-top: 7px;
`

export const FullscreenControl = ({ mapRef }) => {
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
}

const FullscreenController = ({ mapRef }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const onFullscreenChange = useCallback(
    () => setIsFullscreen(screenfull.isFullscreen),
    [],
  )
  useEffect(() => {
    screenfull.on('change', onFullscreenChange)
    return () => screenfull.off('change', onFullscreenChange)
  }, [onFullscreenChange])

  const onClick = useCallback(() => {
    if (screenfull.isEnabled) {
      screenfull.toggle(mapRef.current)
    }
  }, [mapRef])

  return (
    <Button
      onClick={onClick}
      title={isFullscreen ? 'Karte verkleinern' : 'Karte maximieren'}
    >
      {isFullscreen ? <FaCompressArrowsAlt /> : <FaExpandArrowsAlt />}
    </Button>
  )
}

