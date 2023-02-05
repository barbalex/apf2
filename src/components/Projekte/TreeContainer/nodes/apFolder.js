import ap from './ap'

const apFolderNode = async ({ projId, store, treeQueryVariables, count }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ap ?? ''

  const message = nodeLabelFilterString ? `${count} gefiltert` : count

  const showChildren =
    store.tree.openNodes.filter(
      (n) => n[0] === 'Projekte' && n[1] === projId && n[2] === 'Arten',
    ).length > 0

  const children = showChildren
    ? await ap({ projId, store, treeQueryVariables })
    : []

  return {
    nodeType: 'folder',
    menuType: 'apFolder',
    id: `${projId}ApFolder`,
    tableId: projId,
    urlLabel: 'Arten',
    label: `Arten (${message})`,
    url: ['Projekte', projId, 'Arten'],
    hasChildren: count > 0,
    children,
  }
}

export default apFolderNode
