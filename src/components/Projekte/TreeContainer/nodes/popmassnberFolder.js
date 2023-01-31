const popmassnberFolderNode = ({
  count,
  loading,
  projId,
  apId,
  popId,
  store,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.popmassnber ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  return {
    nodeType: 'folder',
    menuType: 'popmassnberFolder',
    filterTable: 'popmassnber',
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
  }
}

export default popmassnberFolderNode
