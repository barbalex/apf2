import { gql } from '@apollo/client'
import { el } from 'date-fns/locale'

import apFolder from './apFolder'

const projektNodes = async ({ store, treeQueryVariables, params }) => {
  const { client } = store

  const { data } = await client.query({
    query: gql`
      query TreeAllQuery {
        allProjekts(orderBy: NAME_ASC) {
          nodes {
            id
            label
          }
        }
      }
    `,
    variables: { id: 1 },
  })
  const projekts = data?.allProjekts?.nodes ?? []

  console.log('nodes, projekt', { projekts, params })

  const apFolderNode = await apFolder({
    projId: el.id,
    store,
    treeQueryVariables,
  })

  const nodes = projekts.map((el) => ({
    nodeType: 'table',
    menuType: 'projekt',
    filterTable: 'projekt',
    id: el.id,
    urlLabel: el.id,
    label: el.label,
    url: ['Projekte', el.id],
    hasChildren: true,
    children: params.projId ? [apFolderNode] : [],
  }))

  return nodes
}

export default projektNodes
