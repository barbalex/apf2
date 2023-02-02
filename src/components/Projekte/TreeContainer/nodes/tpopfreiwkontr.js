import tpopfreiwkontrzaehlFolder from './tpopfreiwkontrzaehlFolder'

import { gql } from '@apollo/client'

const tpopfreiwkontrNodes = async ({
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: [
      'treeTpopfreiwkontr',
      tpopId,
      treeQueryVariables.tpopfreiwkontrsFilter,
    ],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeTpopfreiwkontrQuery(
            $id: UUID!
            $tpopfreiwkontrsFilter: TpopkontrFilter!
          ) {
            tpopById(id: $id) {
              id
              tpopfreiwkontrs: tpopkontrsByTpopId(
                filter: $tpopfreiwkontrsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                nodes {
                  id
                  labelEkf
                }
              }
            }
          }
        `,
        variables: {
          id: tpopId,
          tpopfreiwkontrsFilter: treeQueryVariables.tpopfreiwkontrsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  let nodes = []

  for (const node of data?.tpopById?.tpopfreiwkontrs?.nodes ?? []) {
    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 5 &&
          n[1] === projId &&
          n[3] === apId &&
          n[4] === 'Populationen' &&
          n[5] === popId &&
          n[6] === 'Teil-Populationen' &&
          n[7] === tpopId &&
          n[8] === 'Freiwilligen-Kontrollen' &&
          n[9] === node.id,
      ).length > 0

    let children = []
    if (isOpen) {
      // fetch children
      const { data, isLoading } = await store.queryClient.fetchQuery({
        queryKey: ['treeTpopkontrzaehls', node.id],
        queryFn: () =>
          store.client.query({
            query: gql`
              query TreeTpopfreiwkontrzaehlsQuery(
                $id: UUID!
                $tpopkontrzaehlsFilter: TpopkontrzaehlFilter!
              ) {
                tpopkontrById(id: $id) {
                  id
                  tpopkontrzaehlsByTpopkontrId(filter: $tpopkontrzaehlsFilter) {
                    totalCount
                  }
                }
              }
            `,
            variables: {
              id: node.id,
              tpopkontrzaehlsFilter: treeQueryVariables.tpopkontrzaehlsFilter,
            },
            fetchPolicy: 'no-cache',
          }),
      })
      const folderNode = await tpopfreiwkontrzaehlFolder({
        count:
          data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.totalCount ?? 0,
        loading: isLoading,
        projId,
        apId,
        popId,
        tpopId,
        tpopkontrId: node.id,
        store,
        treeQueryVariables,
      })
      children = [folderNode]
    }

    nodes.push({
      nodeType: 'table',
      menuType: 'tpopfreiwkontr',
      id: node.id,
      tableId: node.id,
      parentId: `${tpopId}TpopfreiwkontrFolder`,
      parentTableId: tpopId,
      urlLabel: node.id,
      label: node.labelEkf,
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
        node.id,
      ],
      hasChildren: true,
      children,
    })
  }

  return nodes
}

export default tpopfreiwkontrNodes
