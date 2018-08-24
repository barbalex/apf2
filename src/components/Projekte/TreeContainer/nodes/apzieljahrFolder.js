// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import union from 'lodash/union'

import allParentNodesAreOpen from '../allParentNodesAreOpen'

export default ({
  data,
  treeName,
  projektNodes,
  projId,
  apNodes,
  openNodes,
  apId,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  apId: String,
}): Array<Object> => {
  const ziels = get(data, 'ziels.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.ziel`)

  const zieljahre = ziels
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.bezeichnung || '(kein Ziel)'} (${get(
          el,
          'zielTypWerteByTyp.text',
          '(kein Typ)',
        )})`.includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
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
    .sort()

  return zieljahre.map((jahr, index) => {
    const zieleOfJahr = ziels
      .filter(el => el.apId === apId)
      .filter(el => el.jahr === jahr)
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          return `${el.bezeichnung || '(kein Ziel)'} (${get(
            el,
            'zielTypWerteByTyp.text',
            '(kein Typ)',
          )})`.includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      })

    return {
      nodeType: 'folder',
      menuType: 'zieljahrFolder',
      filterTable: 'ziel',
      id: jahr || 'keinJahr',
      jahr,
      parentId: apId,
      urlLabel: `${jahr === null || jahr === undefined ? 'kein Jahr' : jahr}`,
      label: `${jahr === null || jahr === undefined ? 'kein Jahr' : jahr} (${
        zieleOfJahr.length
      })`,
      url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', jahr],
      sort: [projIndex, 1, apIndex, 2, index],
      hasChildren: true,
    }
  })
}
