import { gql } from '@apollo/client'

const popberNodes = async ({
  projId,
  apId,
  popId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: ['treeTpop', popId, treeQueryVariables.popbersFilter],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreePopberQuery($id: UUID!, $popbersFilter: PopberFilter!) {
            popById(id: $id) {
              id
              popbersByPopId(filter: $popbersFilter, orderBy: LABEL_ASC) {
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
          popbersFilter: treeQueryVariables.popbersFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  // map through all elements and create array of nodes
  const nodes = (data?.popById?.popbersByPopId?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'popber',
    filterTable: 'popber',
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
      'Kontroll-Berichte',
      el.id,
    ],
    hasChildren: false,
  }))

  return nodes
}

export default popberNodes
