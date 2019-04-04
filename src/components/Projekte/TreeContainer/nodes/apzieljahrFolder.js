// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import union from 'lodash/union'
import memoizeOne from 'memoize-one'

import allParentNodesAreOpen from '../allParentNodesAreOpen'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  projId,
  apNodes,
  openNodes,
  apId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.ziel`) || ''

  const ziels = memoizeOne(() =>
    get(data, 'allZiels.nodes', [])
      // of this ap
      .filter(el => el.apId === apId)
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          return el.label
            .toLowerCase()
            .includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      }),
  )()

  const zieljahre = memoizeOne(() =>
    ziels
      .reduce((a, el, index) => union(a, [el.jahr]), [])
      .filter(jahr =>
        allParentNodesAreOpen(openNodes, [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'AP-Ziele',
          jahr,
        ]),
      )
      .sort(),
  )()

  return zieljahre.map((jahr, index) => {
    const labelJahr = jahr === null || jahr === undefined ? 'kein Jahr' : jahr
    const zieleOfJahr = ziels.filter(el => el.jahr === jahr)
    const labelJahreLength = zieleOfJahr.length

    return {
      nodeType: 'folder',
      menuType: 'zieljahrFolder',
      filterTable: 'ziel',
      id: jahr || 'keinJahr',
      jahr,
      parentId: apId,
      urlLabel: `${jahr === null || jahr === undefined ? 'kein Jahr' : jahr}`,
      label: `${labelJahr} (${labelJahreLength})`,
      url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', jahr],
      sort: [projIndex, 1, apIndex, 2, index],
      hasChildren: true,
    }
  })
}
