import get from 'lodash/get'
import memoizeOne from 'memoize-one'

const adresse = ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  store,
}) => {
  const adresses = get(data, 'allAdresses.nodes', [])
  const wlIndex = projektNodes.length + 2
  const nodes = memoizeOne(() =>
    adresses
      // only show if parent node exists
      .filter((el) => nodesPassed.map((n) => n.id).includes('adresseFolder'))
      .map((el) => ({
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
  )()

  return nodes
}

export default adresse
