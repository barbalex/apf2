import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { FaExpandArrowsAlt, FaCompressArrowsAlt } from 'react-icons/fa'
import screenfull from 'screenfull'

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

const FullscreenControl = ({ mapRef }) => {
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

export default FullscreenControl
