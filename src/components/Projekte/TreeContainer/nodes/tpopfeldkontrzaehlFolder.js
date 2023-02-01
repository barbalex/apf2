import tpopfeldkontrzaehl from './tpopfeldkontrzaehl'

const tpopfeldkontrzaehlFolderNode = async ({
  count,
  loading,
  projId,
  apId,
  popId,
  tpopId,
  tpopkontrId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.tpopkontrzaehl ?? ''

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
    'Feld-Kontrollen',
    tpopkontrId,
    'Zaehlungen',
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
        n[8] === 'Feld-Kontrollen' &&
        n[9] === tpopkontrId &&
        n[10] === 'Zaehlungen',
    ).length > 0

  const children = isOpen
    ? await tpopfeldkontrzaehl({
        treeQueryVariables,
        projId,
        apId,
        popId,
        tpopId,
        tpopkontrId,
        store,
      })
    : []

  return {
    nodeType: 'folder',
    menuType: 'tpopfeldkontrzaehlFolder',
    filterTable: 'tpopkontrzaehl',
    id: `${tpopkontrId}TpopfeldkontrzaehlFolder`,
    tableId: tpopkontrId,
    urlLabel: 'Zaehlungen',
    label: `Zählungen (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default tpopfeldkontrzaehlFolderNode
