import { gql } from '@apollo/client'

const apberNodes = async ({ projId, apId, treeQueryVariables, store }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeApberQuery($apId: UUID!, $apbersFilter: ApberFilter!) {
        apById(id: $apId) {
          id
          apbersByApId(filter: $apbersFilter, orderBy: LABEL_ASC) {
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
      apbersFilter: treeQueryVariables.apbersFilter,
    },
  })

  const apbers = data?.apById?.apbersByApId?.nodes ?? []
  const nodes = apbers.map((el) => ({
    nodeType: 'table',
    menuType: 'apber',
    id: el.id,
    parentId: apId,
    parentTableId: apId,
    urlLabel: el.id,
    label: el.label,
    url: ['Projekte', projId, 'Arten', apId, 'AP-Berichte', el.id],
    hasChildren: false,
  }))

  return nodes
}

export default apberNodes
