import { gql } from '@apollo/client'
import apFolder from './apFolder'
import apberuebersichtFolder from './apberuebersichtFolder'

const projektNodes = async ({ store, treeQueryVariables }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeProjektQuery(
        $apsFilter: ApFilter!
        $apberuebersichtsFilter: ApberuebersichtFilter!
      ) {
        allProjekts(orderBy: NAME_ASC) {
          nodes {
            id
            label
            # directly fetch counts to reduce number of queries
            apberuebersichtsByProjId(filter: $apberuebersichtsFilter) {
              totalCount
            }
            apsByProjId(filter: $apsFilter) {
              totalCount
            }
          }
        }
      }
    `,
    variables: {
      apsFilter: treeQueryVariables.apsFilter,
      apberuebersichtsFilter: treeQueryVariables.apberuebersichtsFilter,
    },
  })
  const projekts = data?.allProjekts?.nodes ?? []

  const nodes = []
  for (const projekt of projekts) {
    if (!store.tree.openProjekts.includes(projekt.id)) {
      // this project is not open
      // no children, apFolder or apUebersichtFolder
      nodes.push({
        nodeType: 'table',
        menuType: 'projekt',
        id: projekt.id,
        urlLabel: projekt.id,
        label: projekt.label,
        url: ['Projekte', projekt.id],
        hasChildren: true,
      })
      continue
    }
    const apFolderNode = await apFolder({
      projId: projekt.id,
      store,
      treeQueryVariables,
      count: projekt.apsByProjId?.totalCount ?? 0,
    })
    const apberUebersichtFolderNode = await apberuebersichtFolder({
      projId: projekt.id,
      store,
      count: projekt.apberuebersichtsByProjId?.totalCount ?? 0,
      treeQueryVariables,
    })
    const children = store.tree.openProjekts.includes(projekt.id)
      ? [apFolderNode, apberUebersichtFolderNode]
      : []

    nodes.push({
      nodeType: 'table',
      menuType: 'projekt',
      id: projekt.id,
      urlLabel: projekt.id,
      label: projekt.label,
      url: ['Projekte', projekt.id],
      hasChildren: true,
      children,
    })
  }

  return nodes
}

export default projektNodes
