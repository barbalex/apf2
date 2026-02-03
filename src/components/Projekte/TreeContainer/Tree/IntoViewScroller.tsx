import { useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'

import {
  treeLastTouchedNodeAtom,
  treeActiveNodeArrayAtom,
} from '../../../../store/index.ts'
import { isElementInViewport } from '../../../../modules/isElementInViewport.ts'

// lets try a different approach:
// compare activeNodeArray with previous value to check, if a node was closed
// (only the last element different i.e. missing). If so: return
export const IntoViewScroller = () => {
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const previousActiveNodeArray = useRef<string[]>([])
  // when opening a folder without activating it, lastTouchedNode is not same as activeNodeArray
  // in this case we do NOT want to scroll to active node that may be out of view
  const lastTouchedNode = useAtomValue(treeLastTouchedNodeAtom)
  // when loading on url, lastTouchedNode may not be set
  const urlToFocus = lastTouchedNode.length ? lastTouchedNode : activeNodeArray

  // 2024.01.17
  // Problem: this was not good enough
  // it worked for nodes with id's that correspond with dataset ids
  // it did not work for folders
  // better solution: every node gets its url in data-url. Then get element by that
  const scroller = () => {
    // 1. Get element with the url to focus
    const selector = `[data-url='${JSON.stringify(urlToFocus)}']`
    const element = document.querySelector(selector)
    // const element = document.getElementById(id)
    // 2. No element yet? Tree may still be loading > try later
    if (!element) return setTimeout(scroller, 150)
    // 3. If the element is visible, do not scroll
    if (isElementInViewport(element)) return
    // 4. The element is not visible? scroll it into view
    element?.scrollIntoView?.({
      block: 'center',
      inline: 'center',
    })
  }

  useEffect(() => {
    const prev = previousActiveNodeArray.current
    // Check if a node was closed: previous array is longer and all activeNodeArray-elements are the same
    if (
      prev.length >= activeNodeArray.length &&
      activeNodeArray.every((element, index) => element === prev[index])
    ) {
      // Node was closed, don't scroll
      previousActiveNodeArray.current = activeNodeArray
      return
    }

    // Update ref for next comparison
    previousActiveNodeArray.current = activeNodeArray

    scroller()
  }, [scroller])

  return null
}
