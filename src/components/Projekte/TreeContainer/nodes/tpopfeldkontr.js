import { gql } from '@apollo/client'

const tpopfeldkontrNodes = async ({
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: [
      'treeTpopfeldkontr',
      tpopId,
      treeQueryVariables.tpopfeldkontrsFilter,
    ],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeTpopfeldkontrQuery(
            $id: UUID!
            $tpopfeldkontrsFilter: TpopkontrFilter!
          ) {
            tpopById(id: $id) {
              id
              tpopfeldkontrs: tpopkontrsByTpopId(
                filter: $tpopfeldkontrsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                nodes {
                  id
                  labelEk
                }
              }
            }
          }
        `,
        variables: {
          id: tpopId,
          tpopfeldkontrsFilter: treeQueryVariables.tpopfeldkontrsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  let nodes = (data?.tpopById?.tpopfeldkontrs?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'tpopfeldkontr',
    filterTable: 'tpopkontr',
    id: el.id,
    parentId: `${tpopId}TpopfeldkontrFolder`,
    parentTableId: tpopId,
    urlLabel: el.id,
    label: el.labelEk,
    url: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      tpopId,
      'Feld-Kontrollen',
      el.id,
    ],
    hasChildren: true,
  }))

  return nodes
}

export default tpopfeldkontrNodes
