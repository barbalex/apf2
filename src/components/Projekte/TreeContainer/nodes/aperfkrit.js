import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

const aperfkritNodes = ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  projId,
  apId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allErfkrits.nodes', [])
      // only show if parent node exists
      .filter((el) =>
        nodesPassed.map((n) => n.id).includes(`${el.apId}Erfkrit`),
      )
      // only show nodes of this parent
      .filter((el) => el.apId === apId)
      .map((el) => ({
        nodeType: 'table',
        menuType: 'erfkrit',
        filterTable: 'erfkrit',
        id: el.id,
        parentId: el.apId,
        parentTableId: el.apId,
        urlLabel: el.id,
        label: el.label,
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          el.apId,
          'AP-Erfolgskriterien',
          el.id,
        ],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 3, index]
        return el
      }),
  )()

  return nodes
}

export default aperfkritNodes
