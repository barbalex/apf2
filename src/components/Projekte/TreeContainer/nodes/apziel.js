// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import allParentNodesExist from '../allParentNodesExist'
import compareLabel from './compareLabel'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  openNodes,
  projId,
  apId,
  jahr,
  apzieljahrFolderNodes,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  projId: String,
  apId: String,
  jahr: Number,
  apzieljahrFolderNodes: Array<Object>,
  mobxStore: Object,
}): Array<Object> => {
  const ziels = get(data, 'allZiels.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.ziel`) || ''
  const zieljahrIndex = findIndex(apzieljahrFolderNodes, el => el.jahr === jahr)

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    ziels
      .filter(el => el.apId === apId)
      .filter(el => el.jahr === jahr)
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          const label = `${el.bezeichnung || '(kein Ziel)'} (${get(
            el,
            'zielTypWerteByTyp.text',
          ) || '(kein Typ)'})`
          return label
            .toLowerCase()
            .includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      })
      .map(el => ({
        nodeType: 'table',
        menuType: 'ziel',
        filterTable: 'ziel',
        id: el.id,
        parentId: el.apId,
        parentTableId: el.apId,
        urlLabel: el.id,
        label: `${el.bezeichnung || '(kein Ziel)'} (${get(
          el,
          'zielTypWerteByTyp.text',
          'kein Typ',
        )})`,
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          el.apId,
          'AP-Ziele',
          el.jahr,
          el.id,
        ],
        hasChildren: true,
      }))
      .filter(el => allParentNodesAreOpen(openNodes, el.url))
      .filter(n => allParentNodesExist(nodesPassed, n))
      // sort by label
      .sort(compareLabel)
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 2, zieljahrIndex, index]
        return el
      }),
  )()

  return nodes
}
