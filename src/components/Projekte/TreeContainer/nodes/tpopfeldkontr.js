import { gql } from '@apollo/client'

import tpopfeldkontrzaehlFolder from './tpopfeldkontrzaehlFolder'

const tpopfeldkontrNodes = async ({
  projId,
  apId,
  popId,
  tpopId,
  store,
  treeQueryVariables,
}) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: [
      'treeTpopfeldkontr',
      tpopId,
      treeQueryVariables.tpopfeldkontrsFilter,
    ],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeTpopfeldkontrQuery(
            $id: UUID!
            $tpopfeldkontrsFilter: TpopkontrFilter!
          ) {
            tpopById(id: $id) {
              id
              tpopfeldkontrs: tpopkontrsByTpopId(
                filter: $tpopfeldkontrsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                nodes {
                  id
                  labelEk
                }
              }
            }
          }
        `,
        variables: {
          id: tpopId,
          tpopfeldkontrsFilter: treeQueryVariables.tpopfeldkontrsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  let nodes = []

  for (const node of data?.tpopById?.tpopfeldkontrs?.nodes ?? []) {
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
          n[8] === 'Feld-Kontrollen' &&
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
              query TreeTpopkontrzaehlsQuery(
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
      const folderNode = await tpopfeldkontrzaehlFolder({
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
      menuType: 'tpopfeldkontr',
      filterTable: 'tpopkontr',
      id: node.id,
      parentId: `${tpopId}TpopfeldkontrFolder`,
      parentTableId: tpopId,
      urlLabel: node.id,
      label: node.labelEk,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Feld-Kontrollen',
        node.id,
      ],
      hasChildren: true,
      children,
    })
  }

  return nodes
}

export default tpopfeldkontrNodes
