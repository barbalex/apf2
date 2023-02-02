import { gql } from '@apollo/client'

const ekzaehleinheitNodes = async ({
  projId,
  apId,
  treeQueryVariables,
  store,
}) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeEkzaehleinheitQuery(
        $apId: UUID!
        $ekzaehleinheitsFilter: EkzaehleinheitFilter!
      ) {
        apById(id: $apId) {
          id
          ekzaehleinheitsByApId(
            filter: $ekzaehleinheitsFilter
            orderBy: [SORT_ASC, LABEL_ASC]
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
      ekzaehleinheitsFilter: treeQueryVariables.ekzaehleinheitsFilter,
    },
  })

  // map through all elements and create array of nodes
  const nodes = (data?.apById?.ekzaehleinheitsByApId?.nodes ?? []).map(
    (el) => ({
      nodeType: 'table',
      menuType: 'ekzaehleinheit',
      id: el.id,
      parentId: apId,
      parentTableId: apId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', apId, 'EK-Zähleinheiten', el.id],
      hasChildren: false,
    }),
  )

  return nodes
}

export default ekzaehleinheitNodes
