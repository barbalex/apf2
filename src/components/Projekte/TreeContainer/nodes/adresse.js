// @flow
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

const createNodes = memoizeOne(
  (adresses, nodeLabelFilterString, nodesPassed, wlIndex) =>
    adresses
      // only show if parent node exists
      .filter(el => nodesPassed.map(n => n.id).includes('adresseFolder'))
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
        menuType: 'adresse',
        filterTable: 'adresse',
        id: el.id,
        parentId: 'adresseFolder',
        urlLabel: el.id,
        label: el.label,
        url: ['Werte-Listen', 'Adressen', el.id],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [wlIndex, 1, index]
        return el
      }),
)

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  mobxStore: Object,
}): Array<Object> => {
  const adresses = get(data, 'allAdresses.nodes', [])
  const wlIndex = projektNodes.length + 2
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.adresse`) || ''
  const nodes = createNodes(
    adresses,
    nodeLabelFilterString,
    nodesPassed,
    wlIndex,
  )

  return nodes
}
