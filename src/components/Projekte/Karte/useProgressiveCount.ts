import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'

/**
 * Above this many markers in a layer ("Layer auch anzeigen, wenn mehr als
 * eine Art aktiv ist"), the markers get no React-rendered tooltips: every
 * permanent tooltip positions itself when its marker is added to the map,
 * and tens of thousands of them block the UI for minutes (quadratic
 * layout, see Tooltip._setPosition). Such layers bind permanent labels
 * imperatively, only for the markers actually displayed, once zoomed in
 * enough that at most this many of their markers remain in view — see the
 * label management in the Pop and Tpop layers.
 */
export const LABELS_MAX_MARKERS = 300

/**
 * Grows a count from chunkSize towards the given length, one chunk per
 * animation frame. Layers with many thousands of markers ("Layer auch
 * anzeigen, wenn mehr als eine Art aktiv ist" loads > 20 000 markers)
 * mount their markers in these chunks instead of one synchronous commit,
 * so the UI stays responsive while they stream in.
 *
 * The count only grows; data refetches reconcile through the markers'
 * stable keys, so panning does not restart it.
 */
export const useProgressiveCount = (length: number, chunkSize = 300) => {
  const [count, setCount] = useState(() => Math.min(chunkSize, length))
  const countRef = useRef(count)

  useEffect(() => {
    countRef.current = count
    if (count >= length) return
    let cancelled = false
    const step = () => {
      if (cancelled) return
      const next = Math.min(countRef.current + chunkSize, length)
      countRef.current = next
      setCount(next)
    }
    const id = requestAnimationFrame(step)
    return () => {
      cancelled = true
      cancelAnimationFrame(id)
    }
  }, [count, length, chunkSize])

  return Math.min(count, length)
}

/**
 * useProgressiveCount, but returning the elements for the first
 * visibleCount items. The created elements are cached and only appended
 * to: re-rendering with a grown count must not re-create the elements of
 * already mounted markers, or every chunk would reconcile all previous
 * ones again (quadratic). Reusing the identical element objects lets
 * React skip them entirely — each chunk mounts only its own items.
 *
 * When the items array changes identity the cache restarts. Within a
 * mount that only happens on refetches that actually changed the data —
 * react-query's structural sharing keeps identical results referentially
 * equal, and changed filters remount the layer via its key.
 */
export const useProgressiveElements = <T,>(
  items: T[],
  createElement: (item: T) => ReactElement,
  chunkSize = 300,
) => {
  const visibleCount = useProgressiveCount(items.length, chunkSize)
  const elementsRef = useRef<ReactElement[]>([])
  const itemsRef = useRef(items)

  if (itemsRef.current !== items) {
    itemsRef.current = items
    elementsRef.current = []
  }
  if (elementsRef.current.length < visibleCount) {
    elementsRef.current = elementsRef.current.concat(
      items.slice(elementsRef.current.length, visibleCount).map(createElement),
    )
  }

  return elementsRef.current
}
