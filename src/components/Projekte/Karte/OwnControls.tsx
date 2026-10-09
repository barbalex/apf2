import { useResizeDetector } from 'react-resize-detector'
import { useDebouncedCallback } from 'use-debounce'

import { LayersControl } from './LayersControl/index.tsx'
import { FullscreenControl } from './FullscreenControl.tsx'
import { PngControl } from './PngControl.tsx'

import styles from './OwnControls.module.css'

interface OwnControlsProps {
  // passed to enforce rerendering when the sorting of the
  // active overlays or apflora layers changes
  activeOverlaysString?: string
  activeApfloraLayersString?: string
  mapRef: React.RefObject<HTMLDivElement | null>
}

export const OwnControls = ({ mapRef }: OwnControlsProps) => {
  /**
   * need to pass the height of the self built controls
   * to move controls built by leaflet when layer menu changes height
   * Beware: If initial value is wrong, map will render twice
   */
  const onResize = ({ height }: { height: number | null }) => {
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
      className={styles.container}
      ref={resizeRef}
    >
      <LayersControl />
      <FullscreenControl mapRef={mapRef} />
      <PngControl />
    </div>
  )
}
