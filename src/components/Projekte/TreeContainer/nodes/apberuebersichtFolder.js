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
  const apberuebersichts = get(data, 'apberuebersichts.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.apberuebersicht`)

  const apberuebersichtNodesLength = apberuebersichts
    .filter(el => el.projId === projId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return el.jahr.toString().includes(nodeLabelFilterString)
      }
      return true
    }).length
  let message = apberuebersichtNodesLength
  if (nodeLabelFilterString) {
    message = `${apberuebersichtNodesLength} gefiltert`
  }

  return [
    {
      menuType: 'apberuebersichtFolder',
      id: projId,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${message})`,
      url: ['Projekte', projId, 'AP-Berichte'],
      sort: [projIndex, 2],
      hasChildren: apberuebersichtNodesLength > 0,
    },
  ]
}
