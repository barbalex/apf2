// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  tree,
  projektNodes,
  apNodes,
  popNodes,
  projId,
  apId,
  popId,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  popNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  console.log({ popNodes, popIndex, popId })
  const nodeLabelFilterString = tree.nodeLabelFilter.get('tpop')

  // map through all elements and create array of nodes
  const nodes = get(data, 'allTpops.nodes', [])
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
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'tpop',
      id: el.id,
      parentId: el.popId,
      urlLabel: el.id,
      label: `${el.nr || '(keine Nr)'}: ${el.flurname || '(kein Flurname)'}`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        el.popId,
        'Teil-Populationen',
        el.id,
      ],
      hasChildren: true,
      nr: el.nr,
    }))
    // sort again to sort (keine Nr) on top
    .sort((a, b) => a.nr - b.nr)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, index]
      return el
    })

  return nodes
}
