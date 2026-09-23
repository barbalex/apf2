import { useEffect, useMemo } from 'react'
import { Pane, useMap } from 'react-leaflet'
import {
  LeafletContext,
  extendContext,
  useLeafletContext,
} from '@react-leaflet/core'
import { createPortal } from 'react-dom'

interface SafePaneProps {
  name: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

/**
 * A wrapper around react-leaflet's Pane component that prevents
 * the "a pane with this name already exists" error.
 *
 * This error occurs when React tries to recreate a pane that already
 * exists in the Leaflet map instance. This component checks if the pane
 * exists and reuses it, or creates it if it doesn't exist yet.
 */
export const SafePane = ({
  name,
  className,
  style,
  children,
}: SafePaneProps) => {
  const map = useMap()
  const context = useLeafletContext()

  // Check synchronously if pane already exists
  const existingPane = useMemo(() => map.getPane(name), [map, name])

  useEffect(() => {
    // look up the pane freshly instead of mutating the memoized value
    const pane = map.getPane(name)
    // Update style and className if pane exists
    if (pane) {
      if (style?.zIndex !== undefined) {
        pane.style.zIndex = String(style.zIndex)
      }
      if (className) {
        // add classes instead of overwriting
        // overwriting removes leaflet's own pane classes
        // which breaks positioning and stacking
        pane.classList.add(...className.split(' ').filter(Boolean))
      }
    }
  }, [map, name, className, style])

  // If pane already exists, render children into it using a portal.
  // Children need a context with the pane set
  // or their layers attach to the default panes instead
  // and the vertical order of the overlays breaks
  if (existingPane) {
    return createPortal(
      <LeafletContext value={extendContext(context, { pane: name })}>
        {children}
      </LeafletContext>,
      existingPane,
    )
  }

  // Otherwise, use the normal Pane component which will create the pane
  return (
    <Pane
      name={name}
      {...(className !== undefined ? { className } : {})}
      {...(style !== undefined ? { style } : {})}
    >
      {children}
    </Pane>
  )
}
