import sum from 'lodash/sum'

import beobNichtBeurteilt from './beobNichtBeurteilt'

const beobNichtBeurteiltFolderNode = async ({
  data,
  loading,
  projId,
  apId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.beob ?? ''

  const aparts = data?.apById?.beobNichtBeurteilt?.nodes ?? []
  const counts = aparts.map(
    (a) => a.aeTaxonomyByArtId?.beobsByArtId?.totalCount ?? 0,
  )
  const count = sum(counts)

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = [
    'Projekte',
    projId,
    'Arten',
    apId,
    'nicht-beurteilte-Beobachtungen',
  ]

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'nicht-beurteilte-Beobachtungen',
    ).length > 0

  const children = isOpen
    ? await beobNichtBeurteilt({ treeQueryVariables, projId, apId, store })
    : []

  return {
    nodeType: 'folder',
    menuType: 'beobNichtBeurteiltFolder',
    filterTable: 'beob',
    id: `${apId}BeobNichtBeurteiltFolder`,
    tableId: apId,
    urlLabel: 'nicht-beurteilte-Beobachtungen',
    label: `Beobachtungen nicht beurteilt (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default beobNichtBeurteiltFolderNode
