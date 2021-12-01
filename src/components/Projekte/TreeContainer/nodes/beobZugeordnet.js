import findIndex from 'lodash/findIndex'
import { DateTime } from 'luxon'

const beobZugeordnetNodes = ({
  nodes: nodesPassed,
  data,
  projektNodes,
  apNodes,
  popNodes,
  tpopNodes,
  projId,
  apId,
  popId,
  tpopId,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })

  // map through all elements and create array of nodes
  const nodes = (data?.allVApbeobsZugeordnet?.nodes ?? [])
    // only show if parent node exists
    .filter((el) =>
      nodesPassed.map((n) => n.id).includes(`${el.tpopId}BeobZugeordnetFolder`),
    )
    // only show nodes of this parent
    .filter((el) => el.tpopId === tpopId)
    .map((el) => {
      // somehow the label passed by the view gets corrupted when the node is active ????!!!
      // instead of '2010.07.02: Dickenmann Regula (EvAB 2016)' it gives: '2010.07.02: Dickenmann RegulaEvAB 2016)'
      // so need to build it here
      const datumIsValid = DateTime.fromSQL(el.datum).isValid
      const datum = datumIsValid
        ? DateTime.fromSQL(el.datum).toFormat('yyyy.LL.dd')
        : '(kein Datum)'
      const label = `${datum}: ${el?.autor ?? '(kein Autor)'} (${
        el?.quelle ?? 'keine Quelle'
      })`

      return {
        nodeType: 'table',
        menuType: 'beobZugeordnet',
        filterTable: 'beob',
        id: el.id,
        parentId: `${el.tpopId}BeobZugeordnetFolder`,
        parentTableId: el.tpopId,
        urlLabel: el.id,
        label,
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Beobachtungen',
          el.id,
        ],
        hasChildren: false,
      }
    })
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6, index]
      return el
    })

  return nodes
}

export default beobZugeordnetNodes
