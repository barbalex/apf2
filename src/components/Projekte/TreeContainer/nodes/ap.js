import { gql } from '@apollo/client'

import popFolder from './popFolder'
import apzielFolder from './apzielFolder'

const ap = async ({ projId, store, treeQueryVariables }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeApsQuery($apsFilter: ApFilter!, $popsFilter: PopFilter!) {
        allAps(filter: $apsFilter, orderBy: LABEL_ASC) {
          nodes {
            id
            label
            popsByApId(filter: $popsFilter) {
              totalCount
            }
          }
        }
      }
    `,
    variables: {
      apsFilter: treeQueryVariables.apsFilter,
      popsFilter: treeQueryVariables.popsFilter,
    },
  })

  const aps = data?.allAps?.nodes ?? []

  // map through all elements and create array of nodes
  let nodes = []
  for (const ap of aps) {
    if (store.tree.openAps.includes(ap.id)) {
      // 1. fetch counts for children
      const { data } = await store.client.query({
        query: gql`
          query TreeApQuery(
            $id: UUID!
            $popsFilter: PopFilter!
            $zielsFilter: ZielFilter!
          ) {
            apById(id: $id) {
              id
              label
              popsByApId(filter: $popsFilter) {
                totalCount
              }
              zielsByApId(filter: $zielsFilter) {
                nodes {
                  id
                  jahr
                }
              }
            }
          }
        `,
        variables: {
          id: ap.id,
          popsFilter: treeQueryVariables.popsFilter,
          zielsFilter: treeQueryVariables.zielsFilter,
        },
      })
      // 2. build children
      const popFolderNode = popFolder({
        projId,
        apId: ap.id,
        store,
        count: data?.apById?.popsByApId?.totalCount ?? 0,
      })
      const apzielFolderNode = apzielFolder({
        data,
        projId,
        apId: ap.id,
        store,
      })

      nodes.push({
        nodeType: 'table',
        menuType: 'ap',
        filterTable: 'ap',
        id: ap.id,
        parentId: projId,
        parentTableId: projId,
        urlLabel: ap.id,
        label: ap.label,
        url: ['Projekte', projId, 'Arten', ap.id],
        hasChildren: true,
        children: [popFolderNode, apzielFolderNode],
      })
      continue
    }
    nodes.push({
      nodeType: 'table',
      menuType: 'ap',
      filterTable: 'ap',
      id: ap.id,
      parentId: projId,
      parentTableId: projId,
      urlLabel: ap.id,
      label: ap.label,
      url: ['Projekte', projId, 'Arten', ap.id],
      hasChildren: true,
    })
  }

  // console.log('nodes, ap, nodes:', nodes)
  return nodes
}

export default ap
