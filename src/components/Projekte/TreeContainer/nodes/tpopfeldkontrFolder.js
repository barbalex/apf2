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
  apNodes,
  openNodes,
  popNodes,
  tpopNodes,
  projId,
  apId,
  popId,
  tpopId,
  nodeFilter,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  popNodes: Array<Object>,
  tpopNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  tpopId: String,
  nodeFilter: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const nodeLabelFilterString = get(
    data,
    `${treeName}.nodeLabelFilter.tpopfeldkontr`,
  )
  const nodeFilterArray = Object.entries(nodeFilter.tpopfeldkontr).filter(
    ([key, value]) => value || value === 0 || value === false,
  )

  let children = get(data, 'tpopfeldkontrs.nodes', [])
    .filter(el => el.tpopId === tpopId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${get(
          el,
          'tpopkontrTypWerteByTyp.text',
        ) || '(kein Typ)'}`
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
        table: 'tpopfeldkontr',
      }),
    )

  /**
   * There is something weird happening when filtering data
   * that leads to duplicate nodes
   * Need to solve that but in the meantime use uniqBy
   */
  children = uniqBy(children, 'id')

  const childrenLength = children.length

  let message = loading && !childrenLength ? '...' : childrenLength
  if (nodeLabelFilterString) {
    message = `${childrenLength} gefiltert`
  }

  const url = [
    'Projekte',
    projId,
    'Aktionspläne',
    apId,
    'Populationen',
    popId,
    'Teil-Populationen',
    tpopId,
    'Feld-Kontrollen',
  ]
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  const nodes = [
    {
      nodeType: 'folder',
      menuType: 'tpopfeldkontrFolder',
      filterTable: 'tpopkontr',
      id: tpopId,
      urlLabel: 'Feld-Kontrollen',
      label: `Feld-Kontrollen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3],
      hasChildren: childrenLength > 0,
    },
  ].filter(n => allParentNodesExist(nodesPassed, n))
  return nodes
}
