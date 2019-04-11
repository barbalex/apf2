//@flow
import getActiveNodeArrayFromPathname from './getActiveNodeArrayFromPathname'

export default ({
  location,
  action,
  store,
}: {
  location: Object,
  action: String,
  store: Object,
}) => {
  const { setTreeKey } = store
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
