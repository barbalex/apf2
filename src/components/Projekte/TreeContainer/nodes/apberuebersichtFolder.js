import findIndex from 'lodash/findIndex'

const apberuebersichtFolderNode = ({
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projNodeIds = projektNodes.map((n) => n.id)
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const nodeLabelFilterString =
    store?.[`${treeName}.nodeLabelFilter.apberuebersicht`] ?? ''

  const apberuebersichtNodesLength = (
    data?.allApberuebersichts?.nodes ?? []
  ).filter((el) => projNodeIds.includes(el.projId)).length
  /*
  let message =
    loading && !apberuebersichtNodesLength ? '...' : apberuebersichtNodesLength
  if (nodeLabelFilterString) {
    message = `${apberuebersichtNodesLength} gefiltert`
  }*/
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${apberuebersichtNodesLength} gefiltert`
    : apberuebersichtNodesLength

  // only show if parent node exists
  if (!projNodeIds.includes(projId)) return []

  return [
    {
      menuType: 'apberuebersichtFolder',
      filterTable: 'apberuebersicht',
      id: projId,
      tableId: projId,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${message})`,
      url: ['Projekte', projId, 'AP-Berichte'],
      sort: [projIndex, 2],
      hasChildren: apberuebersichtNodesLength > 0,
    },
  ]
}

export default apberuebersichtFolderNode
