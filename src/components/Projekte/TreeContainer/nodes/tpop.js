import { gql } from '@apollo/client'

import tpopmassnFolder from './tpopmassnFolder'
import tpopmassnberFolder from './tpopmassnberFolder'

const tpopNodes = async ({
  projId,
  apId,
  popId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: ['treeTpop', popId, treeQueryVariables.tpopsFilter],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeTpopQuery($id: UUID!, $tpopsFilter: TpopFilter!) {
            popById(id: $id) {
              id
              tpopsByPopId(
                filter: $tpopsFilter
                orderBy: [NR_ASC, FLURNAME_ASC]
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
          tpopsFilter: treeQueryVariables.tpopsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const nodes = []
  // map through all elements and create array of nodes
  for (const node of data?.popById?.tpopsByPopId?.nodes ?? []) {
    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 5 &&
          n[1] === projId &&
          n[3] === apId &&
          n[4] === 'Populationen' &&
          n[5] === popId &&
          n[6] === 'Teil-Populationen' &&
          n[7] === node.id,
      ).length > 0

    let children = []

    if (isOpen) {
      const { data, isLoading } = await store.queryClient.fetchQuery({
        queryKey: ['treeTpop', node.id],
        queryFn: () =>
          store.client.query({
            query: gql`
              query TreeTpopQuery(
                $id: UUID!
                $tpopmassnsFilter: TpopmassnFilter!
                $tpopmassnbersFilter: TpopmassnberFilter!
                $tpopbersFilter: TpopberFilter!
              ) {
                tpopById(id: $id) {
                  id
                  tpopmassnsByTpopId(filter: $tpopmassnsFilter) {
                    totalCount
                  }
                  tpopmassnbersByTpopId(filter: $tpopmassnbersFilter) {
                    totalCount
                  }
                  tpopbersByTpopId(filter: $tpopbersFilter) {
                    totalCount
                  }
                }
              }
            `,
            variables: {
              id: node.id,
              tpopmassnsFilter: treeQueryVariables.tpopmassnsFilter,
              tpopmassnbersFilter: treeQueryVariables.tpopmassnbersFilter,
              tpopbersFilter: treeQueryVariables.tpopbersFilter,
            },
            fetchPolicy: 'no-cache',
          }),
      })
      const tpopmassnFolderNode = await tpopmassnFolder({
        count: data?.tpopById?.tpopmassnsByTpopId?.totalCount ?? 0,
        loading: isLoading,
        projId,
        apId,
        popId,
        tpopId: node.id,
        store,
        treeQueryVariables,
      })
      const tpopmassnberFolderNode = await tpopmassnberFolder({
        count: data?.tpopById?.tpopmassnbersByTpopId?.totalCount ?? 0,
        loading: isLoading,
        projId,
        apId,
        popId,
        tpopId: node.id,
        store,
        treeQueryVariables,
      })
      children = [tpopmassnFolderNode, tpopmassnberFolderNode]
    }

    nodes.push({
      nodeType: 'table',
      menuType: 'tpop',
      filterTable: 'tpop',
      id: node.id,
      parentId: `${popId}TpopFolder`,
      parentTableId: popId,
      urlLabel: node.id,
      label: node.label,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        node.id,
      ],
      hasChildren: true,
      children,
    })
  }

  return nodes
}

export default tpopNodes
