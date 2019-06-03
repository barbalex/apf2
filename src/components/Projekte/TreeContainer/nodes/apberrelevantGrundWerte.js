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
        nodesPassed.map(n => n.id).includes('apberrelevantGrundWerteFolder'),
      )
      .map(el => ({
        nodeType: 'table',
        menuType: 'apberrelevantGrundWerte',
        filterTable: 'apberrelevantGrundWerte',
        id: el.id,
        parentId: 'apberrelevantGrundWerteFolder',
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
