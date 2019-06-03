import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  store,
}) => {
  const apberrelevantGrundWertes = get(
    data,
    'allTpopApberrelevantGrundWertes.nodes',
    [],
  )
  const wlIndex = projektNodes.length + 2
  const nodes = memoizeOne(() =>
    apberrelevantGrundWertes
      // only show if parent node exists
      .filter(el =>
        nodesPassed
          .map(n => n.id)
          .includes('tpopApberrelevantGrundWerteFolder'),
      )
      .map(el => ({
        nodeType: 'table',
        menuType: 'tpopApberrelevantGrundWerte',
        filterTable: 'tpopApberrelevantGrundWerte',
        id: el.id,
        parentId: 'tpopApberrelevantGrundWerteFolder',
        urlLabel: el.id,
        label: el.label,
        url: ['Werte-Listen', 'ApberrelevantGrundWerte', el.id],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [wlIndex, 2, index]
        return el
      }),
  )()

  return nodes
}
