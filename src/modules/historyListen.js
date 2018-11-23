//@flow
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
  const { setTreeKey } = mobxStore
  const { pathname, state } = location
  //console.log(action, location.pathname, location.state)
  // prevent never ending loop if user clicks back right after initial loading
  if (!(pathname === '/Projekte' && action === 'PUSH')) {
    const activeNodeArray = getActiveNodeArrayFromPathname(pathname)
    setTreeKey({
      value: activeNodeArray,
      tree: 'tree',
      key: 'activeNodeArray',
    })
    if (
      state &&
      state.openNodes &&
      // this would prevent single project from opening at first load
      !(
        state.openNodes.length === 1 &&
        isEqual(state.openNodes[0], ['Projekte'])
      )
    ) {
      setTreeKey({
        value: state.openNodes,
        tree: 'tree',
        key: 'openNodes',
      })
    }
  }
}
