import findIndex from 'lodash/findIndex'
import union from 'lodash/union'

import allParentNodesAreOpen from '../allParentNodesAreOpen'

const apzieljahrFolderNode = ({
  data,
  projektNodes,
  projId,
  apNodes,
  openNodes,
  apId,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })

  const ziels = (data?.allZiels?.nodes ?? [])
    // of this ap
    .filter((el) => el.apId === apId)

  const zieljahre = ziels
    .reduce((a, el) => union(a, [el.jahr]), [])
    .filter((jahr) =>
      allParentNodesAreOpen(openNodes, [
        'Projekte',
        projId,
        'Arten',
        apId,
        'AP-Ziele',
        jahr,
      ]),
    )
    .sort()

  return zieljahre.map((jahr, index) => {
    const labelJahr = jahr === null || jahr === undefined ? 'kein Jahr' : jahr
    const zieleOfJahr = ziels.filter((el) => el.jahr === jahr)
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
      url: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr],
      sort: [projIndex, 1, apIndex, 2, index],
      hasChildren: true,
    }
  })
}

export default apzieljahrFolderNode
