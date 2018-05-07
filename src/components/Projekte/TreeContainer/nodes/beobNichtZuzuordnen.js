// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import format from 'date-fns/format'

import compareLabel from './compareLabel'

export default ({
  data,
  tree,
  projektNodes,
  apNodes,
  projId,
  apId,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  projId: String,
  apId: String,
}): Array<Object> => {
  const beobNichtZuzuordnens = get(data, 'beobNichtZuzuordnens.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = tree.nodeLabelFilter.get('beobNichtZuzuordnen')

  // map through all elements and create array of nodes
  const nodes = beobNichtZuzuordnens
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${
          el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
        }: ${el.autor || '(kein Autor)'} (${el.quelle})`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'beobNichtZuzuordnen',
      id: el.id,
      parentId: apId,
      urlLabel: el.id,
      label: `${
        el.datum ? format(el.datum, 'YYYY.MM.DD') : '(kein Datum)'
      }: ${el.autor || '(kein Autor)'} (${el.quelle})`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'nicht-zuzuordnende-Beobachtungen',
        el.id,
      ],
      hasChildren: false,
    }))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 10, index]
      return el
    })

  return nodes
}
