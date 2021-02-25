import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

const apberFolderNode = ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.apber`) || ''

  const apberNodesLength = memoizeOne(
    () =>
      get(data, 'allApbers.nodes', []).filter((el) => el.apId === apId).length,
  )()
  /*
  let message = loading && !apberNodesLength ? '...' : apberNodesLength
  if (nodeLabelFilterString) {
    message = `${apberNodesLength} gefiltert`
  }*/
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${apberNodesLength} gefiltert`
    : apberNodesLength

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte']

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'apberFolder',
      filterTable: 'apber',
      id: `${apId}ApberFolder`,
      tableId: apId,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 4],
      hasChildren: apberNodesLength > 0,
    },
  ]
}

export default apberFolderNode
