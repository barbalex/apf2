import { useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

import { isElementInViewport } from '../../../modules/isElementInViewport.js'

const IntoViewScroller = () => {
  const { pathname } = useLocation()
  const slug = pathname.split('/')[2]

  const scroller = useCallback(() => {
    // 1. Get id from url
    if (!slug) return
    // 2. Get its element
    const element = document.getElementById(slug)
    // 3. No element yet? Tree may still be loading > try later
    if (!element) return setTimeout(scroller, 150)
    // 4. Got an element but it is visible? do not scroll
    if (isElementInViewport(element)) return
    // console.log('IntoViewScroller, will scroll id into view:', id)
    // 5. Got an element and it is not visible? scroll it into view
    element?.scrollIntoView?.({
      block: 'center',
      inline: 'center',
    })
  }, [slug])

  useEffect(() => {
    scroller()
  }, [scroller])

  return null
}

export default IntoViewScroller
