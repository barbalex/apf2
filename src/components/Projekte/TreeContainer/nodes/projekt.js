// @flow
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  mobxStore: Object,
}): Array<Object> => {
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.projekt`,
  )
  const projekts = get(data, 'allProjekts.nodes', [])

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    projekts
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          const name = el.name || ''
          return name
            .toLowerCase()
            .includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      })
      // is already sorted by name
      .map((el, index) => ({
        nodeType: 'table',
        menuType: 'projekt',
        filterTable: 'projekt',
        id: el.id,
        urlLabel: el.id,
        label: el.name || '(kein Name)',
        url: ['Projekte', el.id],
        sort: [index],
        hasChildren: true,
      })),
  )()

  return nodes
}
