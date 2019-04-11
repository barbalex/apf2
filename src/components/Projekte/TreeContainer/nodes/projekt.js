// @flow
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  store,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  store: Object,
}): Array<Object> => {
  const projekts = get(data, 'allProjekts.nodes', [])

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    projekts
      // is already sorted by name
      .map((el, index) => ({
        nodeType: 'table',
        menuType: 'projekt',
        filterTable: 'projekt',
        id: el.id,
        urlLabel: el.id,
        label: el.label,
        url: ['Projekte', el.id],
        sort: [index],
        hasChildren: true,
      })),
  )()

  return nodes
}
