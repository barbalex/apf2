// @flow
import get from 'lodash/get'

export default ({
  data,
  tree,
}: {
  data: Object,
  tree: Object,
}): Array<Object> => {
  const { nodeLabelFilter } = tree
  const nodeLabelFilterString = nodeLabelFilter.get('projekt')
  const projekts = get(data, 'allProjekts.nodes', [])

  // map through all elements and create array of nodes
  const nodes = projekts
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return el.name
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    // is already sorted by name
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'projekt',
      id: el.id,
      urlLabel: el.id,
      label: el.name || '(kein Name)',
      url: ['Projekte', el.id],
      sort: [index],
      hasChildren: true,
    }))

  return nodes
}
