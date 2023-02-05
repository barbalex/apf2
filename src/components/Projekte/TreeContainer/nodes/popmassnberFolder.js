import popmassnber from './popmassnber'

const popmassnberFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  popId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.popmassnber ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'Populationen' &&
        n[5] === popId &&
        n[6] === 'Massnahmen-Berichte',
    ).length > 0

  const children = isOpen
    ? await popmassnber({ treeQueryVariables, projId, apId, popId, store })
    : []

  return {
    nodeType: 'folder',
    menuType: 'popmassnberFolder',
    id: `${popId}PopmassnberFolder`,
    tableId: popId,
    urlLabel: 'Massnahmen-Berichte',
    label: `Massnahmen-Berichte (${message})`,
    url: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Massnahmen-Berichte',
    ],
    hasChildren: count > 0,
    children,
  }
}

export default popmassnberFolderNode
