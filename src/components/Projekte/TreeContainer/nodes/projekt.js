import { gql } from '@apollo/client'
import apFolder from './apFolder'
import apberuebersichtFolder from './apberuebersichtFolder'

const projektNodes = async ({ store, treeQueryVariables, params }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeProjektQuery {
        allProjekts(orderBy: NAME_ASC) {
          nodes {
            id
            label
          }
        }
      }
    `,
  })
  const projekts = data?.allProjekts?.nodes ?? []

  if (!params.projId) {
    return projekts.map((el) => ({
      nodeType: 'table',
      menuType: 'projekt',
      filterTable: 'projekt',
      id: el.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', el.id],
      hasChildren: true,
      children: [],
    }))
  }

  const nodes = []
  for (const projekt of projekts) {
    const apFolderNode = await apFolder({
      projId: projekt.id,
      store,
      treeQueryVariables,
    })
    const apberuebersichtFolderNode = await apberuebersichtFolder({
      projId: projekt.id,
      store,
      treeQueryVariables,
    })
    const children = store.tree.openProjekts.includes(projekt.id)
      ? [apFolderNode, apberuebersichtFolderNode]
      : []

    nodes.push({
      nodeType: 'table',
      menuType: 'projekt',
      filterTable: 'projekt',
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
