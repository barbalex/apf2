//@flow
import { getSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'

import getActiveNodeArrayFromPathname from './getActiveNodeArrayFromPathname'

export default ({
  location,
  action,
  mobxStore,
}: {
  location: Object,
  action: String,
  mobxStore: Object,
}) => {
  const { pathname } = location
  const activeNodeArray = getSnapshot(mobxStore.tree.activeNodeArray)
  //console.log(action, location.pathname, location.state)
  // prevent never ending loop if user clicks back right after initial loading
  if (pathname === '/Projekte' && action === 'PUSH') return

  const newActiveNodeArray = getActiveNodeArrayFromPathname(pathname)
  if (!isEqual(activeNodeArray, newActiveNodeArray)) {
    mobxStore.tree.setActiveNodeArray(newActiveNodeArray)
  }
}
