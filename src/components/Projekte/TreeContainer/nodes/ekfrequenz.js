import { gql } from '@apollo/client'

const ekfrequenzNodes = async ({ treeQueryVariables, projId, apId, store }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeEkfrequenzQuery(
        $apId: UUID!
        $ekfrequenzsFilter: EkfrequenzFilter!
      ) {
        apById(id: $apId) {
          id
          ekfrequenzsByApId(filter: $ekfrequenzsFilter, orderBy: SORT_ASC) {
            nodes {
              id
              code
            }
          }
        }
      }
    `,
    variables: {
      apId,
      ekfrequenzsFilter: treeQueryVariables.ekfrequenzsFilter,
    },
  })

  // map through all elements and create array of nodes
  const nodes = (data?.apById?.ekfrequenzsByApId?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'ekfrequenz',
    filterTable: 'ekfrequenz',
    id: el.id,
    parentId: apId,
    parentTableId: apId,
    urlLabel: el.id,
    label: el.code || '(kein Code)',
    url: ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen', el.id],
    hasChildren: false,
  }))

  return nodes
}

export default ekfrequenzNodes
