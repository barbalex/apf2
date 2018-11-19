// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import allParentNodesExist from '../allParentNodesExist'
import filterNodesByNodeFilterArray from '../filterNodesByNodeFilterArray'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  openNodes,
  apId,
  nodeFilter,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  apId: String,
  nodeFilter: Object,
}): Array<Object> => {
  const pops = get(data, 'pops.nodes', [])
  const apFilter = get(data, `${treeName}.apFilter`)
  const nodeFilterArray = Object.entries(nodeFilter.pop).filter(
    ([key, value]) => value || value === 0 || value === false,
  )

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.pop`)

  let popNodes = pops
    .filter(el => el.apId === apId)
    // return empty if ap is not a real ap and apFilter is set
    .filter(el => {
      const isAp = [1, 2, 3].includes(get(el, 'apByApId.bearbeitung'))
      return !(apFilter && !isAp)
    })
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.nr || '(keine Nr)'}: ${el.name || '(kein Name)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    // filter by nodeFilter
    // TODO: would be much better to filter this in query
    // this is done
    // but unfortunately query does not immediatly update
    .filter(node =>
      filterNodesByNodeFilterArray({
        node,
        nodeFilterArray,
        table: 'pop',
      }),
    )
  /**
   * There is something weird happening when filtering data
   * that leads to duplicate nodes
   * Need to solve that but in the meantime use uniqBy
   */
  popNodes = uniqBy(popNodes, 'id')
  const popNodesLength = popNodes.length
  let message = loading && !popNodesLength ? '...' : popNodesLength
  if (nodeLabelFilterString) {
    message = `${popNodesLength} gefiltert`
  }

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'Populationen']
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'popFolder',
      filterTable: 'pop',
      id: apId,
      urlLabel: 'Populationen',
      label: `Populationen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1],
      hasChildren: popNodesLength > 0,
    },
  ].filter(n => allParentNodesExist(nodesPassed, n))
}
