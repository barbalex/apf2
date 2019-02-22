// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import memoizeOne from 'memoize-one'

import compareLabel from './compareLabel'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  projId,
  apId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  projId: String,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  const beobNichtBeurteilts = get(data, 'allVApbeobs.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.beob`,
  )

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    beobNichtBeurteilts
      // only show if parent node exists
      .filter(el =>
        nodesPassed
          .map(n => n.id)
          .includes(`${el.apId}BeobNichtBeurteiltFolder`),
      )
      // only show nodes of this parent
      .filter(el => el.apId === apId)
      // filter by nodeLabelFilter
      .filter(el => {
        // some dates are not valid
        // need to account for that
        let datum = '(kein Datum)'
        if (!isValid(new Date(el.datum))) {
          datum = '(ungültiges Datum)'
        } else if (!!el.datum) {
          datum = format(new Date(el.datum), 'yyyy.MM.dd')
        }

        if (nodeLabelFilterString) {
          return `${datum}: ${el.autor || '(kein Autor)'} (${el.quelle})`
            .toLowerCase()
            .includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      })
      .map(el => {
        // some dates are not valid
        // need to account for that
        let datum = '(kein Datum)'
        if (!isValid(new Date(el.datum))) {
          datum = '(ungültiges Datum)'
        } else if (!!el.datum) {
          datum = format(new Date(el.datum), 'yyyy.MM.dd')
        }

        return {
          nodeType: 'table',
          menuType: 'beobNichtBeurteilt',
          filterTable: 'beob',
          id: el.id,
          parentId: el.apId,
          parentTableId: el.apId,
          urlLabel: el.id,
          label: `${datum}: ${el.autor || '(kein Autor)'} (${el.quelle})`,
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'nicht-beurteilte-Beobachtungen',
            el.id,
          ],
          hasChildren: false,
        }
      })
      // sort by label
      .sort(compareLabel)
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 10, index]
        return el
      }),
  )()

  return nodes
}
