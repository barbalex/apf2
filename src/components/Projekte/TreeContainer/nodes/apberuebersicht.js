import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  projId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projNodeIds = projektNodes.map(n => n.id)
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allApberuebersichts.nodes', [])
      // only show if parent node exists
      .filter(el => projNodeIds.includes(el.projId))
      // only show nodes of this parent
      .filter(el => el.projId === projId)
      .map(el => ({
        nodeType: 'table',
        menuType: 'apberuebersicht',
        filterTable: 'apberuebersicht',
        id: el.id,
        parentId: el.projId,
        parentTableId: el.projId,
        urlLabel: el.jahr || '(kein Jahr)',
        label: el.label,
        url: ['Projekte', el.projId, 'AP-Berichte', el.id],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [projIndex, 2, index]
        return el
      }),
  )()

  return nodes
}
