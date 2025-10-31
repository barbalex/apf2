import styled from '@emotion/styled'
import { useResizeDetector } from 'react-resize-detector'
import { useDebouncedCallback } from 'use-debounce'

import { LayersControl } from './LayersControl/index.jsx'
import { FullscreenControl } from './FullscreenControl.jsx'
import { PngControl } from './PngControl.jsx'

import { container } from './OwnControls.module.css'

export const OwnControls = ({ mapRef }) => {
  /**
   * need to pass the height of the self built controls
   * to move controls built by leaflet when layer menu changes height
   * Beware: If initial value is wrong, map will render twice
   */
  const onResize = ({ height }) => {
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
    <div
      className={container}
      ref={resizeRef}
    >
      <LayersControl />
      <FullscreenControl mapRef={mapRef} />
      <PngControl />
    </div>
  )
}
