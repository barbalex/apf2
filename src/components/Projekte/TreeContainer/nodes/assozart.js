import { gql } from '@apollo/client'

const assozartNodes = async ({ projId, apId, treeQueryVariables, store }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeEkfrequenzQuery(
        $apId: UUID!
        $assozartFilter: AssozartFilter!
      ) {
        apById(id: $apId) {
          id
          assozartsByApId(filter: $assozartFilter, orderBy: LABEL_ASC) {
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
      assozartFilter: treeQueryVariables.assozartFilter,
    },
  })
  // map through all elements and create array of nodes
  const nodes = (data?.apById?.assozartsByApId?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'assozart',
    filterTable: 'assozart',
    id: el.id,
    parentId: apId,
    parentTableId: apId,
    urlLabel: el.id,
    label: el.label,
    url: ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten', el.id],
    hasChildren: false,
  }))

  return nodes
}

export default assozartNodes
