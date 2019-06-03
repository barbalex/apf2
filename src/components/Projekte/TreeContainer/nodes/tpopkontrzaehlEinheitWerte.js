import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  store,
}) => {
  const tpopkontrzaehlEinheitWertes = get(
    data,
    'allTpopkontrzaehlEinheitWertes.nodes',
    [],
  )
  const wlIndex = projektNodes.length + 2
  const nodes = memoizeOne(() =>
    tpopkontrzaehlEinheitWertes
      // only show if parent node exists
      .filter(el =>
        nodesPassed.map(n => n.id).includes('tpopkontrzaehlEinheitWerteFolder'),
      )
      .map(el => ({
        nodeType: 'table',
        menuType: 'tpopkontrzaehlEinheitWerte',
        filterTable: 'tpopkontrzaehlEinheitWerte',
        id: el.id,
        parentId: 'tpopkontrzaehlEinheitWerteFolder',
        urlLabel: el.id,
        label: el.label,
        url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte', el.id],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [wlIndex, 3, index]
        return el
      }),
  )()

  return nodes
}
