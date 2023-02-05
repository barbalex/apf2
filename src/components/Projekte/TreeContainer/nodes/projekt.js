import apFolder from './apFolder'
import apberuebersichtFolder from './apberuebersichtFolder'

const projektNodes = async ({
  store,
  treeQueryVariables,
  projekt,
  isProjectOpen,
}) => {
  if (!isProjectOpen) {
    // this project is not open
    // no children, apFolder or apUebersichtFolder
    return {
      nodeType: 'table',
      menuType: 'projekt',
      id: projekt.id,
      urlLabel: projekt.id,
      label: projekt.label,
      url: ['Projekte', projekt.id],
      hasChildren: true,
    }
  }

  const apFolderNode = await apFolder({
    projId: projekt.id,
    store,
    treeQueryVariables,
    count: projekt?.apsByProjId?.totalCount ?? 0,
  })
  const apberUebersichtFolderNode = await apberuebersichtFolder({
    projId: projekt.id,
    store,
    count: projekt?.apberuebersichtsByProjId?.totalCount ?? 0,
    treeQueryVariables,
  })
  const children = store.tree.openProjekts.includes(projekt.id)
    ? [apFolderNode, apberUebersichtFolderNode]
    : []

  return {
    nodeType: 'table',
    menuType: 'projekt',
    id: projekt.id,
    urlLabel: projekt.id,
    label: projekt.label,
    url: ['Projekte', projekt.id],
    hasChildren: true,
    children,
  }
}

export default projektNodes
