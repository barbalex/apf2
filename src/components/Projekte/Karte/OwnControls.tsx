import { useEffect, useState } from 'react'
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
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  /**
   * need to pass the height of the self built controls
   * to move controls built by leaflet when layer menu changes height
   * Beware: If initial value is wrong, map will render twice
   */
  const onResizeDebounced = useDebouncedCallback((height: number) => {
    document.documentElement.style.setProperty(
      '--map-control-height',
      `${height}px`,
    )
  }, 10)

  useEffect(() => {
    if (!container) {
      return
    }
    const observer = new ResizeObserver((entries) => {
      // there is only a single entry...
      for (const entry of entries) {
        onResizeDebounced(entry.contentRect.height)
      }
    })
    observer.observe(container)
    return () => {
      observer.disconnect()
    }
  }, [container, onResizeDebounced])

  return (
    <div
      className={styles.container}
      ref={setContainer}
    >
      <LayersControl />
      <FullscreenControl mapRef={mapRef} />
      <PngControl />
    </div>
  )
}
