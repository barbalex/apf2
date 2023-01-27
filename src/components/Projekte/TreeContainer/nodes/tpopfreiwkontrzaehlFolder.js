import findIndex from 'lodash/findIndex'

import exists from '../../../../modules/exists'

const tpopfreiwkontrzaehlFolderNode = ({
  nodes: nodesPassed,
  data,
  loading,
  projektNodes,
  apNodes,
  popNodes,
  tpopNodes,
  tpopfreiwkontrNodes,
  projId,
  apId,
  popId,
  tpopId,
  tpopkontrId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const tpopkontrIndex = findIndex(tpopfreiwkontrNodes, { id: tpopkontrId })
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.tpopkontrzaehl ?? ''

  const childrenLength = (data?.allTpopkontrzaehls?.nodes ?? []).filter(
    (el) => el.tpopkontrId === tpopkontrId && exists(el.anzahl),
  ).length

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
    'Freiwilligen-Kontrollen',
    tpopkontrId,
    'Zaehlungen',
  ]

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(tpopkontrId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopfreiwkontrzaehlFolder',
      filterTable: 'tpopkontrzaehl',
      id: `${tpopkontrId}TpopfreiwkontrzaehlFolder`,
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
        4,
        tpopkontrIndex,
        1,
      ],
      hasChildren: childrenLength > 0,
    },
  ]
}

export default tpopfreiwkontrzaehlFolderNode
