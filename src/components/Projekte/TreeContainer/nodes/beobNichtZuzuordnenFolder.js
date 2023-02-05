import sum from 'lodash/sum'

import beobNichtZuzuordnen from './beobNichtZuzuordnen'

const beobNichtZuzuordnenFolderNode = async ({
  data,
  loading,
  projId,
  apId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.beob ?? ''

  const aparts = data?.apById?.beobNichtZuzuordnen?.nodes ?? []
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
    'nicht-zuzuordnende-Beobachtungen',
  ]

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'nicht-zuzuordnende-Beobachtungen',
    ).length > 0

  const children = isOpen
    ? await beobNichtZuzuordnen({ treeQueryVariables, projId, apId, store })
    : []

  return {
    nodeType: 'folder',
    menuType: 'beobNichtZuzuordnenFolder',
    id: `${apId}BeobNichtZuzuordnenFolder`,
    tableId: apId,
    urlLabel: 'nicht-zuzuordnende-Beobachtungen',
    label: `Beobachtungen nicht zuzuordnen (${message})`,
    url,
    hasChildren: count > 0,
    children,
  }
}

export default beobNichtZuzuordnenFolderNode
