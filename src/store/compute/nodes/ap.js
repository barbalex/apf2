import findIndex from 'lodash/findIndex'

import nodeIsOpen from '../../../modules/nodeIsOpen'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })

  // map through all ap and create array of nodes
  return tree.filteredAndSorted.ap.map((el, index) => {
    const url = [`Projekte`, el.ProjId, `Arten`, el.ApArtId]
    return {
      nodeType: `table`,
      menuType: `ap`,
      id: el.ApArtId,
      parentId: el.ProjId,
      urlLabel: el.ApArtId,
      label: el.label,
      expanded: nodeIsOpen(url),
      url,
      sort: [projIndex, 1, index],
      hasChildren: true
    }
  })
}
