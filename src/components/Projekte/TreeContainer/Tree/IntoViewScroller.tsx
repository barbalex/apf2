import { useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { isElementInViewport } from '../../../../modules/isElementInViewport.ts'

export const IntoViewScroller = observer(() => {
  const store = useContext(MobxContext)
  const { activeNodeArray } = store.tree
  // when opening a folder without activating it, lastTouchedNode is not same as activeNodeArray
  // in this case we do NOT want to scroll to active node that may be out of view
  const lastTouchedNode = store.tree.lastTouchedNode?.slice()
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
    scroller()
  }, [scroller])

  return null
})
