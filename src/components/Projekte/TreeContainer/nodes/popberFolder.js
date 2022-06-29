import findIndex from 'lodash/findIndex'

const popberFolderNode = ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  apNodes,
  popNodes,
  projId,
  apId,
  popId,
  store,
}) => {
  // return empty if ap is not a real ap and apFilter is set
  const ap = (data?.allAps?.nodes ?? []).find((n) => n.id === apId)
  const isAp = ap && [1, 2, 3].includes(ap.bearbeitung) //@485
  const apFilter = store?.[treeName]?.apFilter
  if (!!apFilter && !isAp) return []

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const nodeLabelFilterString = store?.[treeName]?.nodeLabelFilter?.popber ?? ''

  const childrenLength = (data?.allPopbers?.nodes ?? []).filter(
    (el) => el.popId === popId,
  ).length

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${childrenLength} gefiltert`
    : childrenLength

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(popId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'popberFolder',
      filterTable: 'popber',
      id: `${popId}PopberFolder`,
      tableId: popId,
      urlLabel: 'Kontroll-Berichte',
      label: `Kontroll-Berichte (${message})`,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Kontroll-Berichte',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 2],
      hasChildren: childrenLength > 0,
    },
  ]
}

export default popberFolderNode
