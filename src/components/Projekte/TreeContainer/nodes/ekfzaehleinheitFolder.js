// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesAreOpen from '../allParentNodesAreOpen'

export default ({
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  openNodes,
  apId,
}: {
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  apId: String,
}): Array<Object> => {
  const ekfzaehleinheits = get(data, 'ekfzaehleinheits.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(
    data,
    `${treeName}.nodeLabelFilter.ekfzaehleinheit`,
  )

  const ekfzaehleinheitNodesLength = ekfzaehleinheits
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const artname =
          get(el, 'tpopkontrzaehlEinheitWerteByZaehleinheitId.text') ||
          '(keine Zähleinheit gewählt)'
        return artname
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message =
    loading && !ekfzaehleinheitNodesLength ? '...' : ekfzaehleinheitNodesLength
  if (nodeLabelFilterString) {
    message = `${ekfzaehleinheitNodesLength} gefiltert`
  }

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'EKF-Zähleinheiten']
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'ekfzaehleinheitFolder',
      filterTable: 'ekfzaehleinheit',
      id: apId,
      urlLabel: 'EKF-Zähleinheiten',
      label: `EKF-Zähleinheiten (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 9],
      hasChildren: ekfzaehleinheitNodesLength > 0,
    },
  ]
}
