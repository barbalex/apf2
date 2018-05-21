// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  treeName,
  projektNodes,
  projId,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  projId: String,
}): Array<Object> => {
  const aps = get(data, 'aps.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.ap`)

  const apNodesLength = aps
    .filter(el => el.projId === projId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return get(el, 'aeEigenschaftenByArtId.artname', '')
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = apNodesLength
  if (nodeLabelFilterString) {
    message = `${apNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'apFolder',
      id: projId,
      urlLabel: 'Aktionspläne',
      label: `Aktionspläne (${message})`,
      url: ['Projekte', projId, 'Aktionspläne'],
      sort: [projIndex, 1],
      hasChildren: apNodesLength > 0,
    },
  ]
}
