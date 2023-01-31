import { gql } from '@apollo/client'

const popNodes = async ({ projId, apId, store, treeQueryVariables }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreePopQuery($apId: UUID!, $popsFilter: PopFilter!) {
        apById(id: $apId) {
          id
          popsByApId(filter: $popsFilter, orderBy: [NR_ASC, NAME_ASC]) {
            nodes {
              id
              nr
              label
            }
          }
        }
      }
    `,
    variables: {
      apId,
      popsFilter: treeQueryVariables.popsFilter,
    },
  })

  // map through all elements and create array of nodes
  const nodes = (data?.apById?.popsByApId?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'pop',
    filterTable: 'pop',
    id: el.id,
    parentId: `${apId}PopFolder`,
    parentTableId: apId,
    urlLabel: el.id,
    label: el.label,
    url: ['Projekte', projId, 'Arten', apId, 'Populationen', el.id],
    hasChildren: true,
    // TODO: why is this needed?
    nr: el.nr || 0,
  }))

  return nodes
}

export default popNodes
