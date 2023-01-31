import { gql } from '@apollo/client'

const tpopNodes = async ({
  projId,
  apId,
  popId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: ['treeTpop', popId, treeQueryVariables.tpopsFilter],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeTpopQuery($id: UUID!, $tpopsFilter: TpopFilter!) {
            popById(id: $id) {
              id
              tpopsByPopId(
                filter: $tpopsFilter
                orderBy: [NR_ASC, FLURNAME_ASC]
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
          id: popId,
          tpopsFilter: treeQueryVariables.tpopsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  // map through all elements and create array of nodes
  const nodes = (data?.popById?.tpopsByPopId?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'tpop',
    filterTable: 'tpop',
    id: el.id,
    parentId: `${popId}TpopFolder`,
    parentTableId: popId,
    urlLabel: el.id,
    label: el.label,
    url: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      el.id,
    ],
    hasChildren: true,
  }))
  // TODO: check: sort again to sort (keine Nr) on top
  // .sort((a, b) => a.nr - b.nr)

  return nodes
}

export default tpopNodes
