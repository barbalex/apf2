import { gql } from '@apollo/client'

const ekAbrechnungstypWerteNodes = async ({ store, treeQueryVariables }) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: [
      'treeEkAbrechnungstypWertes',
      treeQueryVariables.ekAbrechnungstypWertesFilter,
    ],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeEkAbrechnungstypWertesQuery(
            $ekAbrechnungstypWertesFilter: EkAbrechnungstypWerteFilter!
          ) {
            allEkAbrechnungstypWertes(
              filter: $ekAbrechnungstypWertesFilter
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
          ekAbrechnungstypWertesFilter:
            treeQueryVariables.ekAbrechnungstypWertesFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const nodes = (data?.allEkAbrechnungstypWertes?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'ekAbrechnungstypWerte',
    id: el.id,
    parentId: 'ekAbrechnungstypWerteFolder',
    urlLabel: el.id,
    label: el.label,
    url: ['Werte-Listen', 'EkAbrechnungstypWerte', el.id],
    hasChildren: false,
  }))

  return nodes
}

export default ekAbrechnungstypWerteNodes
