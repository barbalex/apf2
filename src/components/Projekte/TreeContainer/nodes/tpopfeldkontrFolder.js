import findIndex from 'lodash/findIndex'
import uniqBy from 'lodash/uniqBy'

const tpopfeldkontrFolderNode = ({
  nodes: nodesPassed,
  data,
  loading,
  projektNodes,
  apNodes,
  popNodes,
  tpopNodes,
  projId,
  apId,
  popId,
  tpopId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpopkontr ?? ''

  let children = (data?.allTpopfeldkontrs?.nodes ?? []).filter(
    (el) => el.tpopId === tpopId,
  )

  /**
   * There is something weird happening when filtering data
   * that leads to duplicate nodes
   * Need to solve that but in the meantime use uniqBy
   */
  children = uniqBy(children, 'id')

  const childrenLength = children.length

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${childrenLength} gefiltert`
    : childrenLength

  const url = [
    'Projekte',
    projId,
    'Arten',
    apId,
    'Populationen',
    popId,
    'Teil-Populationen',
    tpopId,
    'Feld-Kontrollen',
  ]

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(tpopId)) return []

  const nodes = [
    {
      nodeType: 'folder',
      menuType: 'tpopfeldkontrFolder',
      filterTable: 'tpopkontr',
      id: `${tpopId}TpopfeldkontrFolder`,
      tableId: tpopId,
      urlLabel: 'Feld-Kontrollen',
      label: `Feld-Kontrollen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3],
      hasChildren: childrenLength > 0,
    },
  ]
  return nodes
}

export default tpopfeldkontrFolderNode
