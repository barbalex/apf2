import popber from './popber'

const popberFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  popId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.popber ?? ''

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
        n[6] === 'Kontroll-Berichte',
    ).length > 0

  const children = isOpen
    ? await popber({ treeQueryVariables, projId, apId, popId, store })
    : []

  return {
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
    hasChildren: count > 0,
    children,
  }
}

export default popberFolderNode
