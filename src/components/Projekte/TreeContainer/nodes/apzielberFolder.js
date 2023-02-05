import { gql } from '@apollo/client'

import apzielber from './apzielber'

const apzielberFolderNode = async ({
  projId,
  apId,
  jahr,
  zielId,
  store,
  treeQueryVariables,
}) => {
  const { data, isLoading } = await store.queryClient.fetchQuery({
    queryKey: [
      'treeApzielberFolder',
      zielId,
      treeQueryVariables.zielbersFilter,
    ],
    queryFn: async () => {
      const { data, loading: isLoading } = await store.client.query({
        query: gql`
          query TreeApzielberFolderQuery(
            $zielId: UUID!
            $zielbersFilter: ZielberFilter!
          ) {
            zielById(id: $zielId) {
              id
              zielbersByZielId(filter: $zielbersFilter, orderBy: LABEL_ASC) {
                nodes {
                  id
                  label
                }
              }
            }
          }
        `,
        variables: {
          zielId,
          zielbersFilter: treeQueryVariables.zielbersFilter,
        },
        fetchPolicy: 'no-cache',
      })
      return { data, isLoading }
    },
  })

  // const { data, loading: isLoading } = await store.client.query({
  //   query: gql`
  //     query TreeApzielberFolderQuery(
  //       $zielId: UUID!
  //       $zielbersFilter: ZielberFilter!
  //     ) {
  //       zielById(id: $zielId) {
  //         id
  //         zielbersByZielId(filter: $zielbersFilter, orderBy: LABEL_ASC) {
  //           nodes {
  //             id
  //             label
  //           }
  //         }
  //       }
  //     }
  //   `,
  //   variables: {
  //     zielId,
  //     zielbersFilter: treeQueryVariables.zielbersFilter,
  //   },
  // })

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.zielber ?? ''
  const zielbers = data?.zielById?.zielbersByZielId?.nodes ?? []
  const zielbersLength = zielbers.length
  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${zielbersLength} gefiltert`
    : zielbersLength

  const url = [
    'Projekte',
    projId,
    'Arten',
    apId,
    'AP-Ziele',
    jahr,
    zielId,
    'Berichte',
  ]

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 7 &&
        n[1] === projId &&
        n[3] === apId &&
        n[4] === 'AP-Ziele' &&
        n[5] === jahr &&
        n[6] === zielId,
    ).length > 0

  const children = isOpen
    ? apzielber({
        zielbers,
        projId,
        apId,
        jahr,
        zielId,
      })
    : []

  return [
    {
      nodeType: 'folder',
      menuType: 'zielberFolder',
      id: `${zielId}ZielberFolder`,
      tableId: zielId,
      urlLabel: 'Berichte',
      label: `Berichte (${message})`,
      url,
      hasChildren: zielbersLength > 0,
      children,
    },
  ]
}

export default apzielberFolderNode
