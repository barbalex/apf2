import { gql } from '@apollo/client'

const tpopberNodes = async ({
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: ['treeTpopber', tpopId, treeQueryVariables.tpopbersFilter],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeTpopberQuery($id: UUID!, $tpopbersFilter: TpopberFilter!) {
            tpopById(id: $id) {
              id
              tpopbersByTpopId(filter: $tpopbersFilter, orderBy: LABEL_ASC) {
                nodes {
                  id
                  label
                }
              }
            }
          }
        `,
        variables: {
          id: tpopId,
          tpopbersFilter: treeQueryVariables.tpopbersFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const nodes = (data?.tpopById?.tpopbersByTpopId?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'tpopber',
    parentId: `${tpopId}TpopberFolder`,
    parentTableId: tpopId,
    id: el.id,
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
      tpopId,
      'Kontroll-Berichte',
      el.id,
    ],
    hasChildren: false,
  }))

  return nodes
}

export default tpopberNodes
