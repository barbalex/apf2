const popberFolderNode = ({ count, loading, projId, apId, popId, store }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.popber ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

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
    }
}

export default popberFolderNode
