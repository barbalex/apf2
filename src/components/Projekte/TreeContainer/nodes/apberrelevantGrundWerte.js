import { gql } from '@apollo/client'

const apberrelevantGrundWerteNodes = async ({ store, treeQueryVariables }) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: [
      'treeApberrelevantGrundWertes',
      treeQueryVariables.apberrelevantGrundWertesFilter,
    ],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeApberrelevantGrundWerteQuery(
            $apberrelevantGrundWertesFilter: TpopApberrelevantGrundWerteFilter!
          ) {
            allTpopApberrelevantGrundWertes(
              filter: $apberrelevantGrundWertesFilter
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
          apberrelevantGrundWertesFilter:
            treeQueryVariables.apberrelevantGrundWertesFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const nodes = (data?.allTpopApberrelevantGrundWertes?.nodes ?? []).map(
    (el) => ({
      nodeType: 'table',
      menuType: 'tpopApberrelevantGrundWerte',
      filterTable: 'tpopApberrelevantGrundWerte',
      id: el.id,
      parentId: 'tpopApberrelevantGrundWerteFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'ApberrelevantGrundWerte', el.id],
      hasChildren: false,
    }),
  )

  return nodes
}

export default apberrelevantGrundWerteNodes
