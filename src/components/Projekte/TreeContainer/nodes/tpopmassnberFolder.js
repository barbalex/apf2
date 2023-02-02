import tpopmassnber from './tpopmassnber'

const tpopmassnberFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpopmassnber ?? ''

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
    'Massnahmen-Berichte',
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
        n[8] === 'Massnahmen-Berichte',
    ).length > 0

  const children = isOpen
    ? await tpopmassnber({
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
    menuType: 'tpopmassnberFolder',
    id: `${tpopId}TpopmassnberFolder`,
    tableId: tpopId,
    urlLabel: 'Massnahmen-Berichte',
    label: `Massnahmen-Berichte (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }

  return node
}

export default tpopmassnberFolderNode
