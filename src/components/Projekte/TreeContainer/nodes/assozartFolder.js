import findIndex from 'lodash/findIndex'

const assozartFolderNode = ({ count, loading, projId, apId, store }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.assozart ?? ''

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten']

  return {
    nodeType: 'folder',
    menuType: 'assozartFolder',
    filterTable: 'assozart',
    id: `${apId}AssozartFolder`,
    tableId: apId,
    urlLabel: 'assoziierte-Arten',
    label: `assoziierte Arten (${message})`,
    url,
    hasChildren: count > 0,
  }
}

export default assozartFolderNode
