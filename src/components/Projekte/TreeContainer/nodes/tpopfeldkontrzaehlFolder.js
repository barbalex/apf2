import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  apNodes,
  popNodes,
  tpopNodes,
  tpopfeldkontrNodes,
  projId,
  apId,
  popId,
  tpopId,
  tpopkontrId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  popNodes: Array<Object>,
  tpopNodes: Array<Object>,
  tpopfeldkontrNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  tpopId: String,
  tpopkontrId: String,
  mobxStore: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const tpopkontrIndex = findIndex(tpopfeldkontrNodes, { id: tpopkontrId })
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.tpopkontrzaehl`) || ''

  const childrenLength = memoizeOne(
    () =>
      get(data, 'allTpopkontrzaehls.nodes', []).filter(
        el => el.tpopkontrId === tpopkontrId,
      ).length,
  )()

  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${childrenLength} gefiltert`
    : childrenLength

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
    tpopkontrId,
    'Zaehlungen',
  ]

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(tpopkontrId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopfeldkontrzaehlFolder',
      filterTable: 'tpopkontrzaehl',
      id: `${tpopkontrId}TpopfeldkontrzaehlFolder`,
      tableId: tpopkontrId,
      urlLabel: 'Zaehlungen',
      label: `Zählungen (${message})`,
      url,
      sort: [
        projIndex,
        1,
        apIndex,
        1,
        popIndex,
        1,
        tpopIndex,
        3,
        tpopkontrIndex,
        1,
      ],
      hasChildren: childrenLength > 0,
    },
  ]
}
