import { gql } from '@apollo/client'

const aperfkritNodes = async ({ projId, apId, treeQueryVariables, store }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeAperfkritQuery($apId: UUID!, $erfkritsFilter: ErfkritFilter!) {
        apById(id: $apId) {
          id
          erfkritsByApId(
            filter: $erfkritsFilter
            orderBy: AP_ERFKRIT_WERTE_BY_ERFOLG__SORT_ASC
          ) {
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
      erfkritsFilter: treeQueryVariables.erfkritsFilter,
    },
  })

  // map through all elements and create array of nodes
  const nodes = (data?.apById?.erfkritsByApId?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'erfkrit',
    id: el.id,
    parentId: apId,
    parentTableId: apId,
    urlLabel: el.id,
    label: el.label,
    url: ['Projekte', projId, 'Arten', apId, 'AP-Erfolgskriterien', el.id],
    hasChildren: false,
  }))

  return nodes
}

export default aperfkritNodes
