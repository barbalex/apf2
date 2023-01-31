import { gql } from '@apollo/client'

import tpopFolder from './tpopFolder'
import popberFolder from './popberFolder'
import popmassnberFolder from './popmassnberFolder'

const popNodes = async ({ projId, apId, store, treeQueryVariables }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreePopQuery($apId: UUID!, $popsFilter: PopFilter!) {
        apById(id: $apId) {
          id
          popsByApId(filter: $popsFilter, orderBy: [NR_ASC, NAME_ASC]) {
            nodes {
              id
              # nr
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
      const { data, loading } = await store.client.query({
        query: gql`
          query TreePopQuery($id: UUID!) {
            popById(id: $id) {
              id
              tpopsByPopId {
                totalCount
              }
              popmassnbersByPopId {
                totalCount
              }
              popbersByPopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          id: node.id,
        },
      })
      const tpopCount = data?.popById?.tpopsByPopId?.totalCount ?? 0
      const popmassnberCount =
        data?.popById?.popmassnbersByPopId?.totalCount ?? 0
      const popberCount = data?.popById?.popbersByPopId?.totalCount ?? 0
      const tpopFolderNodes = await tpopFolder({
        count: tpopCount,
        loading,
        projId,
        apId,
        popId: node.id,
        store,
      })
      const popberFolderNodes = await popberFolder({
        count: popberCount,
        loading,
        projId,
        apId,
        popId: node.id,
        store,
      })
      const popmassnberFolderNodes = await popmassnberFolder({
        count: popmassnberCount,
        loading,
        projId,
        apId,
        popId: node.id,
        store,
      })
      children = [tpopFolderNodes, popberFolderNodes, popmassnberFolderNodes]
    }

    nodes.push({
      nodeType: 'table',
      menuType: 'pop',
      filterTable: 'pop',
      id: node.id,
      parentId: `${apId}PopFolder`,
      parentTableId: apId,
      urlLabel: node.id,
      label: node.label,
      url: ['Projekte', projId, 'Arten', apId, 'Populationen', node.id],
      hasChildren: true,
      children,
      // TODO: why is this needed?
      // nr: el.nr || 0,
    })
  }

  return nodes
}

export default popNodes
