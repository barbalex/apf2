import { gql } from '@apollo/client'

const tpopkontrzaehlEinheitWerteNodes = async ({
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: [
      'treeTpopkontrzaehlEinheitWertes',
      treeQueryVariables.tpopkontrzaehlEinheitWertesFilter,
    ],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeTpopkontrzaehlEinheitWertesQuery(
            $tpopkontrzaehlEinheitWertesFilter: TpopkontrzaehlEinheitWerteFilter!
          ) {
            allTpopkontrzaehlEinheitWertes(
              filter: $tpopkontrzaehlEinheitWertesFilter
              orderBy: SORT_ASC
            ) {
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: {
          tpopkontrzaehlEinheitWertesFilter:
            treeQueryVariables.tpopkontrzaehlEinheitWertesFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const nodes = (data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []).map(
    (el) => ({
      nodeType: 'table',
      menuType: 'tpopkontrzaehlEinheitWerte',
      id: el.id,
      parentId: 'tpopkontrzaehlEinheitWerteFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte', el.id],
      hasChildren: false,
    }),
  )

  return nodes
}

export default tpopkontrzaehlEinheitWerteNodes
