// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import apNodes from './ap'

export default ({
  data,
  tree,
  projId,
  apId,
}: {
  data: Object,
  tree: Object,
  projId: number,
  apId: number,
}): Array<Object> => {
  const projekts = get(data, 'allProjekts.nodes', [])
  const pops = get(data, 'allPops.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projekts, {
    id: projId,
  })
  const apIndex = findIndex(apNodes({ data, tree, projId }), { id: apId })
  const nodeLabelFilterString = tree.nodeLabelFilter.get('pop')

  // map through all pop and create array of nodes
  const nodes = pops
    .filter(el => el.apId === apId)
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
      menuType: 'pop',
      id: el.id,
      parentId: el.apId,
      urlLabel: el.id,
      label: `${el.nr || '(keine Nr)'}: ${el.name || '(kein Name)'}`,
      url: ['Projekte', projId, 'Aktionspläne', el.apId, 'Populationen', el.id],
      hasChildren: true,
      nr: el.nr,
    }))
    .sort((a, b) => a.nr - b.nr)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, index]
      return el
    })

  //console.log('popNodes:', { projekts, aps, pops, nodes })
  return nodes
}
