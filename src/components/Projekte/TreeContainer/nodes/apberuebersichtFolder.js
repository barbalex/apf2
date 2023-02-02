import apberuersicht from './apberuebersicht'

const apberuebersichtFolderNode = async ({
  projId,
  store,
  count,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.apberuebersicht ?? ''

  const message = nodeLabelFilterString ? `${count} gefiltert` : count

  const showChildren =
    store.tree.openNodes.filter(
      (n) => n[0] === 'Projekte' && n[1] === projId && n[2] === 'AP-Berichte',
    ).length > 0

  const children = showChildren
    ? await apberuersicht({ store, treeQueryVariables })
    : []

  return {
    menuType: 'apberuebersichtFolder',
    id: `${projId}ApberuebersichtsFolder`,
    tableId: projId,
    urlLabel: 'AP-Berichte',
    label: `AP-Berichte (${message})`,
    url: ['Projekte', projId, 'AP-Berichte'],
    hasChildren: count > 0,
    children,
  }
}

export default apberuebersichtFolderNode
