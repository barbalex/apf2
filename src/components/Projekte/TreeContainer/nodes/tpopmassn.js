import { gql } from '@apollo/client'

const tpopmassnNodes = async ({
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: ['treeTpopmassn', tpopId, treeQueryVariables.tpopmassnsFilter],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeTpopmassnQuery(
            $id: UUID!
            $tpopmassnsFilter: TpopmassnFilter!
          ) {
            tpopById(id: $id) {
              id
              tpopmassnsByTpopId(
                filter: $tpopmassnsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
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
          id: tpopId,
          tpopmassnsFilter: treeQueryVariables.tpopmassnsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const nodes = (data?.tpopById?.tpopmassnsByTpopId?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'tpopmassn',
    filterTable: 'tpopmassn',
    id: el.id,
    parentId: tpopId,
    parentTableId: tpopId,
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
      'Massnahmen',
      el.id,
    ],
    hasChildren: false,
  }))

  return nodes
}

export default tpopmassnNodes
