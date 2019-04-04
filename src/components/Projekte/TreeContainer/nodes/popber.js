// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  popNodes,
  projId,
  apId,
  popId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  popNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  mobxStore: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.popber`) || ''

  // map through all elements and create array of nodes
  const nodes = get(data, 'allPopbers.nodes', [])
    // only show if parent node exists
    .filter(el =>
      nodesPassed.map(n => n.id).includes(`${el.popId}PopberFolder`),
    )
    // only show nodes of this parent
    .filter(el => el.popId === popId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return el.label
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'popber',
      filterTable: 'popber',
      id: el.id,
      parentId: el.popId,
      parentTableId: el.popId,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Kontroll-Berichte',
        el.id,
      ],
      hasChildren: false,
    }))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 2, index]
      return el
    })
  return nodes
}
