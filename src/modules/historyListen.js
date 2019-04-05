//@flow
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
  const { pathname } = location
  //console.log(action, location.pathname, location.state)
  // prevent never ending loop if user clicks back right after initial loading
  if (pathname === '/Projekte' && action === 'PUSH') return

  const activeNodeArray = getActiveNodeArrayFromPathname(pathname)
  setTreeKey({
    value: activeNodeArray,
    tree: 'tree',
    key: 'activeNodeArray',
  })
}
