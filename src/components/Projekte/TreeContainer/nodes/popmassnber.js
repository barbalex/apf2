import { gql } from '@apollo/client'

const popmassnberNodes = async ({
  projId,
  apId,
  popId,
  treeQueryVariables,
  store,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: ['treePopmassnber', popId, treeQueryVariables.popmassnbersFilter],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeTpopmassnberQuery(
            $id: UUID!
            $popmassnbersFilter: PopmassnberFilter!
          ) {
            popById(id: $id) {
              id
              popmassnbersByPopId(
                filter: $popmassnbersFilter
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
          id: popId,
          popmassnbersFilter: treeQueryVariables.popmassnbersFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const nodes = (data?.popById?.popmassnbersByPopId?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'popmassnber',
    filterTable: 'popmassnber',
    id: el.id,
    parentId: popId,
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
      'Massnahmen-Berichte',
      el.id,
    ],
    hasChildren: false,
  }))

  return nodes
}

export default popmassnberNodes
