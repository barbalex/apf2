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

export const OwnControls = ({  mapRef }) => {
  /**
   * need to pass the height of the self built controls
   * to move controls built by leaflet when layer menu changes height
   * Beware: If initial value is wrong, map will render twice
   */
  const onResize = ({ width, height }) => {
    document.documentElement.style.setProperty(
      '--map-control-height',
      `${height ?? 167}px`,
    )
  }

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
