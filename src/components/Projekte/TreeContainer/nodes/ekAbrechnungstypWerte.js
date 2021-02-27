import get from 'lodash/get'
import memoizeOne from 'memoize-one'

const ekAbrechnungstypWerteNodes = ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  store,
}) => {
  const ekAbrechnungstypWertes = get(
    data,
    'allEkAbrechnungstypWertes.nodes',
    [],
  )
  const wlIndex = projektNodes.length + 2
  const nodes = memoizeOne(() =>
    ekAbrechnungstypWertes
      // only show if parent node exists
      .filter((el) =>
        nodesPassed.map((n) => n.id).includes('ekAbrechnungstypWerteFolder'),
      )
      .map((el) => ({
        nodeType: 'table',
        menuType: 'ekAbrechnungstypWerte',
        filterTable: 'ekAbrechnungstypWerte',
        id: el.id,
        parentId: 'ekAbrechnungstypWerteFolder',
        urlLabel: el.id,
        label: el.label,
        url: ['Werte-Listen', 'EkAbrechnungstypWerte', el.id],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [wlIndex, 3, index]
        return el
      }),
  )()

  return nodes
}

export default ekAbrechnungstypWerteNodes
