// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import compareLabel from './compareLabel'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  projId,
  apId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  projId: String,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  const aparts = get(data, 'allAparts.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.apart`,
  )

  // map through all elements and create array of nodes
  const nodes = aparts
    // only show if parent node exists
    .filter(el => nodesPassed.map(n => n.id).includes(`${el.apId}Apart`))
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const apart =
          get(el, 'aeEigenschaftenByArtId.artname') || '(keine Art gewählt)'
        return apart.toLowerCase().includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'apart',
      filterTable: 'apart',
      id: el.id,
      parentId: apId,
      urlLabel: el.id,
      label: get(el, 'aeEigenschaftenByArtId.artname', '(keine Art gewählt)'),
      url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Arten', el.id],
      hasChildren: false,
    }))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 7, index]
      return el
    })

  return nodes
}
