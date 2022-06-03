import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useResizeDetector } from 'react-resize-detector'
import { useDebouncedCallback } from 'use-debounce'

import LayersControl from './LayersControl'
import PngControl from './PngControl'

const Container = styled.div` 
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const OwnControls = ({ treeName, setControlHeight }) => {
  const onResize = useCallback(
    (width, height) => {
      //console.log('height:', height)
      setControlHeight(Math.round(height))
    },
    [setControlHeight],
  )
  const onResizeDebounced = useDebouncedCallback(onResize, 10)
  const { ref: resizeRef } = useResizeDetector({
    onResize: onResizeDebounced,
  })

  return (
    <Container ref={resizeRef}>
      <LayersControl treeName={treeName} />
      <PngControl />
    </Container>
  )
}

export default OwnControls
