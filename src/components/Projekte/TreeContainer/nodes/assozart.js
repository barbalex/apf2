// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
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
  const assozarts = get(data, 'allAssozarts.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.assozart`,
  )

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    assozarts
      // only show if parent node exists
      .filter(el =>
        nodesPassed.map(n => n.id).includes(`${el.apId}AssozartFolder`),
      )
      // only show nodes of this parent
      .filter(el => el.apId === apId)
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          const artname =
            get(el, 'aeEigenschaftenByAeId.artname') || '(keine Art gewählt)'
          return artname
            .toLowerCase()
            .includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      })
      .map(el => ({
        nodeType: 'table',
        menuType: 'assozart',
        filterTable: 'assozart',
        id: el.id,
        parentId: el.apId,
        parentTableId: el.apId,
        urlLabel: el.id,
        label: get(el, 'aeEigenschaftenByAeId.artname', '(keine Art gewählt)'),
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'assoziierte-Arten',
          el.id,
        ],
        hasChildren: false,
      }))
      // sort by label
      .sort(compareLabel)
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 8, index]
        return el
      }),
  )()

  return nodes
}
