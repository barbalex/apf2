// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import compareLabel from './compareLabel'

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
  const assozarts = get(data, 'assozarts.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.assozart`)

  // map through all elements and create array of nodes
  const nodes = assozarts
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return get(el, 'aeEigenschaftenByAeId.artname', '(keine Art gewählt)')
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'assozart',
      id: el.id,
      parentId: apId,
      urlLabel: el.id,
      label: get(el, 'aeEigenschaftenByAeId.artname', '(keine Art gewählt)'),
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'assoziierte-Arten',
        el.id,
      ],
      hasChildren: false,
    }))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 8, index]
      return el
    })

  return nodes
}
