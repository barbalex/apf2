import { gql } from '@apollo/client'

const beobZugeordnetNodes = async ({
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: [
      'treeBeobZugeordnet',
      tpopId,
      treeQueryVariables.beobZugeordnetsFilter,
    ],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeBeobZugeordnetQuery(
            $id: UUID!
            $beobZugeordnetsFilter: BeobFilter!
          ) {
            tpopById(id: $id) {
              id
              beobsByTpopId(
                filter: $beobZugeordnetsFilter
                orderBy: LABEL_DESC
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
          beobZugeordnetsFilter: treeQueryVariables.beobZugeordnetsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const nodes = (data?.apBeobsZugeordnet?.nodes ?? []).map((el) => {
    return {
      nodeType: 'table',
      menuType: 'beobZugeordnet',
      id: el.id,
      parentId: `${tpopId}BeobZugeordnetFolder`,
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
        'Beobachtungen',
        el.id,
      ],
      hasChildren: false,
    }
  })

  return nodes
}

export default beobZugeordnetNodes
