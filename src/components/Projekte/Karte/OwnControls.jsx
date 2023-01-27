import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { useResizeDetector } from 'react-resize-detector'
import { useDebouncedCallback } from 'use-debounce'

import LayersControl from './LayersControl'
import PngControl from './PngControl'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const OwnControls = ({ setControlHeight }) => {
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
      <LayersControl />
      <PngControl />
    </Container>
  )
}

export default OwnControls
