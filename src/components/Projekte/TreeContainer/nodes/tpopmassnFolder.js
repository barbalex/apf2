import tpopmassn from './tpopmassn'

const tpopmassnFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpopmassn ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = [
    'Projekte',
    projId,
    'Arten',
    apId,
    'Populationen',
    popId,
    'Teil-Populationen',
    tpopId,
    'Massnahmen',
  ]

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'Populationen' &&
        n[5] === popId &&
        n[6] === 'Teil-Populationen' &&
        n[7] === tpopId &&
        n[8] === 'Massnahmen',
    ).length > 0

  const children = isOpen
    ? await tpopmassn({
        treeQueryVariables,
        projId,
        apId,
        popId,
        tpopId,
        store,
      })
    : []

  const node = {
    nodeType: 'folder',
    menuType: 'tpopmassnFolder',
    filterTable: 'tpopmassn',
    id: `${tpopId}TpopmassnFolder`,
    tableId: tpopId,
    urlLabel: 'Massnahmen',
    label: `Massnahmen (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }

  return node
}

export default tpopmassnFolderNode
