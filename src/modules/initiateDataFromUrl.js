// @flow
import getActiveNodeArrayFromPathname from './getActiveNodeArrayFromPathname'
import getUrlQuery from '../modules/getUrlQuery'
import isMobilePhone from '../modules/isMobilePhone'
import setUrlQueryValue from '../modules/setUrlQueryValue'
import setOpenNodesFromActiveNodeArray from '../modules/setOpenNodesFromActiveNodeArray'

export default async ({
  activeNodeArray: activeNodeArrayPassed,
  mobxStore,
}) => {
  const { setUrlQuery, cloneTree2From1 } = mobxStore
  const activeNodeArrayFromPathname =
    activeNodeArrayPassed || getActiveNodeArrayFromPathname()
  let initialActiveNodeArray = [...activeNodeArrayFromPathname]
  // fetch query here, BEFORE mutating active node array
  const urlQuery = getUrlQuery()
  const { projekteTabs, feldkontrTab } = urlQuery

  // forward apflora.ch to Projekte
  if (activeNodeArrayFromPathname.length === 0) {
    initialActiveNodeArray.push('Projekte')
  }
  mobxStore.setTreeKey({
    value: initialActiveNodeArray,
    tree: 'tree',
    key: 'activeNodeArray',
  })
  // need to set openNodes
  setOpenNodesFromActiveNodeArray({
    activeNodeArray: initialActiveNodeArray,
    mobxStore,
  })
  // clone tree2 in case tree2 is open
  cloneTree2From1()
  setUrlQuery({ projekteTabs, feldkontrTab })

  // set projekte tabs of not yet existing
  if (
    (activeNodeArrayFromPathname.length === 0 ||
      activeNodeArrayFromPathname[0] === 'Projekte') &&
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
