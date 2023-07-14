import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { useResizeDetector } from 'react-resize-detector'
import { useDebouncedCallback } from 'use-debounce'

import LayersControl from './LayersControl'
import FullscreenControl from './FullscreenControl'
import PngControl from './PngControl'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const OwnControls = ({ setControlHeight, mapRef }) => {
  const onResize = useCallback(
    (width, height) => {
      //console.log('height:', height)
      setControlHeight(Math.round(height ?? 127))
    },
    [setControlHeight],
  )
  const onResizeDebounced = useDebouncedCallback(onResize, 10)
  const { ref: resizeRef } = useResizeDetector({
    onResize: onResizeDebounced,
  })

  return (
    <Container ref={resizeRef}>
      <LayersControl />
      <FullscreenControl mapRef={mapRef} />
      <PngControl />
    </Container>
  )
}

export default OwnControls
