// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  treeName,
  projektNodes,
  apNodes,
  projId,
  apId,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  projId: String,
  apId: String,
}): Array<Object> => {
  const apbers = get(data, 'apbers.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.apber`)

  // map through all elements and create array of nodes
  const nodes = apbers
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return (el.jahr || '(kein Jahr)').includes(
          nodeLabelFilterString.toLowerCase()
        )
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'apber',
      id: el.id,
      parentId: el.apId,
      urlLabel: el.id,
      label: el.jahr || '(kein Jahr)',
      url: ['Projekte', projId, 'Aktionspläne', el.apId, 'AP-Berichte', el.id],
      hasChildren: false,
    }))
    // sort by label
    .sort((a, b) => (a.jahr || 0) - (b.jahr || 0))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 4, index]
      return el
    })

  return nodes
}
