// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import union from 'lodash/union'

export default ({
  data,
  tree,
  projektNodes,
  projId,
  apId,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array<Object>,
  projId: String,
  apId: String,
}): Array<Object> => {
  const ziels = get(data, 'ziels.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )
  const nodeLabelFilterString = tree.nodeLabelFilter.get('ziel')

  const zieljahre = ziels
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.bezeichnung || '(kein Ziel)'} (${get(
          el,
          'zielTypWerteByTyp.text',
          '(kein Typ)'
        )})`.includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .reduce((a, el, index) => union(a, [el.jahr]), [])
    .sort()

  return zieljahre.map((jahr, index) => ({
    nodeType: 'folder',
    menuType: 'zieljahr',
    id: apId,
    parentId: apId,
    urlLabel: `${jahr === null || jahr === undefined ? 'kein Jahr' : jahr}`,
    label: `${jahr === null || jahr === undefined ? 'kein Jahr' : jahr} (${
      zieljahre.length
    })`,
    url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', jahr],
    sort: [projIndex, 1, apIndex, 2, index],
    hasChildren: true,
  }))
}
