// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
}: {
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  apId: String,
}): Array<Object> => {
  // return empty if ap is not a real ap and apFilter is set
  const ap = get(data, 'aps.nodes', []).filter(n => n.id === apId)
  const isAp = [1, 2, 3].includes(ap.bearbeitung)
  const apFilter = get(data, `${treeName}.apFilter`)
  if (!!apFilter && !isAp) return []

  const aparts = get(data, 'aparts.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.apart`)

  const apartNodesLength = aparts
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const artname =
          get(el, 'aeEigenschaftenByArtId.artname') || '(keine Art gewählt)'
        return artname
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = loading && !apartNodesLength ? '...' : apartNodesLength
  if (nodeLabelFilterString) {
    message = `${apartNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'apartFolder',
      filterTable: 'apart',
      id: apId,
      urlLabel: 'AP-Arten',
      label: `AP-Arten (${message})`,
      url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Arten'],
      sort: [projIndex, 1, apIndex, 7],
      hasChildren: apartNodesLength > 0,
    },
  ]
}
