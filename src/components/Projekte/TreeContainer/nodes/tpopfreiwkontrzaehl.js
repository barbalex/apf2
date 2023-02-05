import { gql } from '@apollo/client'

const tpopfreiwkontrzaehlNodes = async ({
  projId,
  apId,
  popId,
  tpopId,
  tpopkontrId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: [
      'treeTpopfeldkontrzaehl',
      tpopkontrId,
      treeQueryVariables.tpopkontrzaehlsFilter,
    ],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeTpopfreiwkontrzaehlQuery(
            $id: UUID!
            $tpopkontrzaehlsFilter: TpopkontrzaehlFilter!
          ) {
            tpopkontrById(id: $id) {
              id
              tpopkontrzaehlsByTpopkontrId(
                filter: $tpopkontrzaehlsFilter
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
          id: tpopkontrId,
          tpopkontrzaehlsFilter: treeQueryVariables.tpopkontrzaehlsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // map through all elements and create array of nodes
  const nodes = (
    data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
  ).map((el) => ({
    nodeType: 'table',
    menuType: 'tpopfreiwkontrzaehl',
    id: el.id,
    parentId: `${el.tpopkontrId}TpopfreiwkontrzaehlFolder`,
    parentTableId: el.tpopkontrId,
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
      'Freiwilligen-Kontrollen',
      tpopkontrId,
      'Zaehlungen',
      el.id,
    ],
    hasChildren: false,
  }))

  return nodes
}

export default tpopfreiwkontrzaehlNodes
