import { useEffect, useMemo } from 'react'
import { Pane, useMap } from 'react-leaflet'
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

  // Check synchronously if pane already exists
  const existingPane = useMemo(() => map.getPane(name), [map, name])

  useEffect(() => {
    // Update style and className if pane exists
    if (existingPane) {
      if (style?.zIndex !== undefined) {
        existingPane.style.zIndex = String(style.zIndex)
      }
      if (className) {
        existingPane.className = className
      }
    }
  }, [existingPane, className, style])

  // If pane already exists, render children into it using a portal
  if (existingPane) {
    return createPortal(children, existingPane)
  }

  // Otherwise, use the normal Pane component which will create the pane
  return (
    <Pane name={name} className={className} style={style}>
      {children}
    </Pane>
  )
}
