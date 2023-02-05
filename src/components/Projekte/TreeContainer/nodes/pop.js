import { gql } from '@apollo/client'

import tpopFolder from './tpopFolder'
import popberFolder from './popberFolder'
import popmassnberFolder from './popmassnberFolder'

const popNodes = async ({ projId, apId, store, treeQueryVariables }) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: ['treePops', apId, treeQueryVariables.popsFilter],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreePopQuery($apId: UUID!, $popsFilter: PopFilter!) {
            apById(id: $apId) {
              id
              popsByApId(filter: $popsFilter, orderBy: [NR_ASC, NAME_ASC]) {
                nodes {
                  id
                  label
                }
              }
            }
          }
        `,
        variables: {
          apId,
          popsFilter: treeQueryVariables.popsFilter,
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  const nodes = []

  for (const node of data?.apById?.popsByApId?.nodes ?? []) {
    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 5 &&
          n[1] === projId &&
          n[3] === apId &&
          n[4] === 'Populationen' &&
          n[5] === node.id,
      ).length > 0

    let children = []
    if (isOpen) {
      const { data, isLoading } = await store.queryClient.fetchQuery({
        queryKey: ['treePop', node.id],
        queryFn: () =>
          store.client.query({
            query: gql`
              query TreePopQuery(
                $id: UUID!
                $tpopsFilter: TpopFilter!
                $popbersFilter: PopberFilter!
                $popmassnbersFilter: PopmassnberFilter!
              ) {
                popById(id: $id) {
                  id
                  tpopsByPopId(filter: $tpopsFilter) {
                    totalCount
                  }
                  popmassnbersByPopId(filter: $popmassnbersFilter) {
                    totalCount
                  }
                  popbersByPopId(filter: $popbersFilter) {
                    totalCount
                  }
                }
              }
            `,
            variables: {
              id: node.id,
              tpopsFilter: treeQueryVariables.tpopsFilter,
              popbersFilter: treeQueryVariables.popbersFilter,
              popmassnbersFilter: treeQueryVariables.popmassnbersFilter,
            },
            fetchPolicy: 'no-cache',
          }),
      })
      const tpopCount = data?.popById?.tpopsByPopId?.totalCount ?? 0
      const popmassnberCount =
        data?.popById?.popmassnbersByPopId?.totalCount ?? 0
      const popberCount = data?.popById?.popbersByPopId?.totalCount ?? 0
      const tpopFolderNodes = await tpopFolder({
        count: tpopCount,
        loading: isLoading,
        projId,
        apId,
        popId: node.id,
        store,
        treeQueryVariables,
      })
      const popberFolderNodes = await popberFolder({
        count: popberCount,
        loading: isLoading,
        projId,
        apId,
        popId: node.id,
        store,
        treeQueryVariables,
      })
      const popmassnberFolderNodes = await popmassnberFolder({
        count: popmassnberCount,
        loading: isLoading,
        projId,
        apId,
        popId: node.id,
        store,
        treeQueryVariables,
      })
      children = [tpopFolderNodes, popberFolderNodes, popmassnberFolderNodes]
    }

    nodes.push({
      nodeType: 'table',
      menuType: 'pop',
      id: node.id,
      parentId: `${apId}PopFolder`,
      parentTableId: apId,
      urlLabel: node.id,
      label: node.label,
      url: ['Projekte', projId, 'Arten', apId, 'Populationen', node.id],
      hasChildren: true,
      children,
    })
  }

  return nodes
}

export default popNodes
