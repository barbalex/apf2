import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface UseElementSizeOptions {
  /**
   * Debounces state updates by this many milliseconds (trailing edge).
   * Prevents rerenders while an element is resized continuously,
   * e.g. during a window drag.
   */
  debounceMs?: number
  /**
   * When false, height changes do not update state.
   * Use this when only the width matters, to prevent unnecessary rerenders.
   */
  handleHeight?: boolean
}

/**
 * Measures an element via a native ResizeObserver.
 * Attach the returned ref to the element to measure.
 * Width and height stay undefined until the first measurement
 * has been delivered (delayed by debounceMs when set).
 */
export const useElementSize = <E extends HTMLElement = HTMLDivElement>({
  debounceMs = 0,
  handleHeight = true,
}: UseElementSizeOptions = {}) => {
  const [element, setElement] = useState<E | null>(null)
  const [width, setWidth] = useState<number | undefined>(undefined)
  const [height, setHeight] = useState<number | undefined>(undefined)

  const setSize = (nextWidth: number, nextHeight: number) => {
    // setting an unchanged value makes React skip the rerender
    setWidth((previousWidth) =>
      previousWidth === nextWidth ? previousWidth : nextWidth,
    )
    if (handleHeight) {
      setHeight((previousHeight) =>
        previousHeight === nextHeight ? previousHeight : nextHeight,
      )
    }
  }

  const setSizeDebounced = useDebouncedCallback(setSize, debounceMs)

  useEffect(() => {
    if (!element) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      // there is only a single entry...
      for (const entry of entries) {
        setSizeDebounced(entry.contentRect.width, entry.contentRect.height)
      }
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
      // prevent a stale trailing update for a no longer observed element
      setSizeDebounced.cancel()
    }
  }, [element, setSizeDebounced])

  return { ref: setElement, width, height }
}
