import { gql } from '@apollo/client'

const ap = async ({ projId, store, treeQueryVariables }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeApFolderQuery($apsFilter: ApFilter!) {
        allAps(filter: $apsFilter, orderBy: LABEL_ASC) {
          nodes {
            id
            label
          }
        }
      }
    `,
    variables: { apsFilter: treeQueryVariables.apsFilter },
  })

  const aps = data?.allAps?.nodes ?? []

  // map through all elements and create array of nodes
  const nodes = aps.map((el) => ({
    nodeType: 'table',
    menuType: 'ap',
    filterTable: 'ap',
    id: el.id,
    parentId: projId,
    parentTableId: projId,
    urlLabel: el.id,
    label: el.label,
    url: ['Projekte', projId, 'Arten', el.id],
    hasChildren: true,
  }))

  return nodes
}

export default ap
