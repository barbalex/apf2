import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'
import { DateTime } from 'luxon'

const beobNichtZuzuordnenNodes = ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  openNodes,
  projId,
  apId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allVApbeobsNichtZuzuordnen.nodes', [])
      // only show if parent node exists
      .filter((el) =>
        nodesPassed
          .map((n) => n.id)
          .includes(`${el.apId}BeobNichtZuzuordnenFolder`),
      )
      // only show nodes of this parent
      .filter((el) => el.apId === apId)
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
          menuType: 'beobNichtZuzuordnen',
          filterTable: 'beob',
          id: el.id,
          parentId: el.apId,
          parentTableId: el.apId,
          urlLabel: el.id,
          label,
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'nicht-zuzuordnende-Beobachtungen',
            el.id,
          ],
          hasChildren: false,
        }
      })
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 12, index]
        return el
      }),
  )()

  return nodes
}

export default beobNichtZuzuordnenNodes
