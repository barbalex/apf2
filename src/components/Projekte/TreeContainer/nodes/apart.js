import { gql } from '@apollo/client'

const apartNodes = async ({ projId, apId, treeQueryVariables, store }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeApartQuery($apId: UUID!, $apartsFilter: ApartFilter!) {
        apById(id: $apId) {
          id
          apartsByApId(filter: $apartsFilter, orderBy: LABEL_ASC) {
            nodes {
              id
              label
            }
          }
        }
      }
    `,
    variables: {
      apId,
      apartsFilter: treeQueryVariables.apartsFilter,
    },
  })
  // map through all elements and create array of nodes
  const nodes = (data?.apById?.apartsByApId?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'apart',
    id: el.id,
    parentId: apId,
    parentTableId: apId,
    urlLabel: el.id,
    label: el.label,
    url: ['Projekte', projId, 'Arten', apId, 'Taxa', el.id],
    hasChildren: false,
  }))

  return nodes
}

export default apartNodes
