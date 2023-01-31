import { gql } from '@apollo/client'

const tpopmassnberNodes = async ({
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: [
      'treeTpopmassnber',
      tpopId,
      treeQueryVariables.tpopmassnbersFilter,
    ],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeTpopmassnQuery(
            $id: UUID!
            $tpopmassnbersFilter: TpopmassnberFilter!
          ) {
            tpopById(id: $id) {
              id
              tpopmassnbersByTpopId(
                filter: $tpopmassnbersFilter
                orderBy: LABEL_ASC
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
          tpopmassnbersFilter: treeQueryVariables.tpopmassnbersFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const nodes = (data?.tpopById?.tpopmassnbersByTpopId?.nodes ?? []).map(
    (el) => ({
      nodeType: 'table',
      menuType: 'tpopmassnber',
      filterTable: 'tpopmassnber',
      parentId: tpopId,
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
        'Massnahmen-Berichte',
        el.id,
      ],
      hasChildren: false,
    }),
  )

  return nodes
}

export default tpopmassnberNodes
