import React, { useCallback, useEffect, useState } from 'react'
import 'leaflet'
import styled from '@emotion/styled'
import { FaExpandArrowsAlt, FaCompressArrowsAlt } from 'react-icons/fa'
import screenfull from 'screenfull'

const StyledButton = styled.button`
  background-color: white;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-clip: padding-box;
  cursor: pointer;
  svg {
    padding-top: 3px;
    color: rgba(0, 0, 0, 0.8) !important;
    font-size: 1.1rem;
  }
  margin-top: 7px;
`

const FullscreenControl = ({ mapRef }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const onChange = useCallback(
    () => setIsFullscreen(screenfull.isFullscreen),
    [],
  )
  useEffect(() => {
    screenfull.on('change', onChange)

    return () => screenfull.off('change', onChange)
  }, [onChange])

  const onClick = useCallback(() => {
    if (screenfull.isEnabled) {
      screenfull?.toggle?.(mapRef.current)
    }
  }, [mapRef])

  return (
    <StyledButton
      onClick={onClick}
      title={isFullscreen ? 'Karte verkleinern' : 'Karte maximieren'}
    >
      {isFullscreen ? <FaCompressArrowsAlt /> : <FaExpandArrowsAlt />}
    </StyledButton>
  )
}

export default FullscreenControl
