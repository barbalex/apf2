import styled from '@emotion/styled'
import { useResizeDetector } from 'react-resize-detector'
import { useDebouncedCallback } from 'use-debounce'

import { LayersControl } from './LayersControl/index.jsx'
import { FullscreenControl } from './FullscreenControl.jsx'
import { PngControl } from './PngControl.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const OwnControls = ({ setControlHeight, mapRef }) => {
  const onResize = ({ width, height }) =>
    setControlHeight(Math.round(height ?? 167))

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
