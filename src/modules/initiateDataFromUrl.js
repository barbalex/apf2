import getActiveNodeArrayFromPathname from './getActiveNodeArrayFromPathname'
import getUrlQuery from '../modules/getUrlQuery'
import isMobilePhone from '../modules/isMobilePhone'
import setUrlQueryValue from '../modules/setUrlQueryValue'
import setOpenNodesFromActiveNodeArray from '../modules/setOpenNodesFromActiveNodeArray'

export default ({ activeNodeArray: activeNodeArrayPassed, store }) => {
  const { setUrlQuery, cloneTree2From1 } = store
  const activeNodeArrayFromPathname =
    activeNodeArrayPassed || getActiveNodeArrayFromPathname()
  let initialActiveNodeArray = [...activeNodeArrayFromPathname]
  // fetch query here, BEFORE mutating active node array
  const urlQuery = getUrlQuery()
  const { projekteTabs } = urlQuery

  store.tree.setActiveNodeArray(initialActiveNodeArray)
  // need to set openNodes
  setOpenNodesFromActiveNodeArray({
    activeNodeArray: initialActiveNodeArray,
    store,
  })
  // clone tree2 in case tree2 is open
  cloneTree2From1()
  setUrlQuery(urlQuery)

  // set projekte tabs of not yet existing
  if (
    activeNodeArrayFromPathname[0] === 'Projekte' &&
    (!projekteTabs || !projekteTabs.length || projekteTabs.length === 0)
  ) {
    if (isMobilePhone()) {
      setUrlQueryValue({
        key: 'projekteTabs',
        value: ['tree'],
        urlQuery,
        setUrlQuery,
      })
    } else {
      setUrlQueryValue({
        key: 'projekteTabs',
        value: ['tree', 'daten'],
        urlQuery,
        setUrlQuery,
      })
    }
  }
}
