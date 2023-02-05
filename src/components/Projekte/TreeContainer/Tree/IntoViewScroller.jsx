import { useEffect, useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../storeContext'
import isElementInViewport from '../../../../modules/isElementInViewport'
import getLastIdFromUrl from '../../../../modules/getLastIdFromUrl'

const IntoViewScroller = () => {
  const store = useContext(storeContext)
  const { activeNodeArray } = store.tree

  const scroller = useCallback(() => {
    console.log('IntoViewScroller running')
    const id = getLastIdFromUrl(activeNodeArray)
    if (!id) return setTimeout(scroller, 150)
    // 2. get its element
    const element = document.getElementById(id)
    if (!element) return setTimeout(scroller, 150)
    if (isElementInViewport(element)) return
    // console.log('IntoViewScroller, will scroll id into view:', id)
    element?.scrollIntoView?.({
      block: 'center',
      inline: 'center',
    })
  }, [activeNodeArray])

  useEffect(() => {
    scroller()
  }, [scroller])

  return null
}

export default observer(IntoViewScroller)
