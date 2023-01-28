import { gql } from '@apollo/client'

import ap from './ap'

const apFolderNode = async ({ projId, store, treeQueryVariables }) => {
  const { client } = store

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ap ?? ''

  const { data, loading } = await client.query({
    query: gql`
      query TreeApFolderQuery($apsFilter: ApFilter!) {
        allAps(filter: $apsFilter) {
          totalCount
        }
      }
    `,
    variables: { apsFilter: treeQueryVariables.apsFilter },
  })

  const count = data?.allAps?.totalCount ?? 0

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const showChildren =
    store.tree.openNodes.filter(
      (n) => n[0] === 'Projekte' && n[1] === projId && n[2] === 'Arten',
    ).length > 0

  if (!showChildren) {
    return {
      nodeType: 'folder',
      menuType: 'apFolder',
      filterTable: 'ap',
      id: `${projId}ApFolder`,
      tableId: projId,
      urlLabel: 'Arten',
      label: `Arten (${message})`,
      url: ['Projekte', projId, 'Arten'],
      hasChildren: count > 0,
    }
  }

  const children = await ap({ projId, store, treeQueryVariables })

  return {
    nodeType: 'folder',
    menuType: 'apFolder',
    filterTable: 'ap',
    id: `${projId}ApFolder`,
    tableId: projId,
    urlLabel: 'Arten',
    label: `Arten (${message})`,
    url: ['Projekte', projId, 'Arten'],
    hasChildren: count > 0,
    children,
  }
}

export default apFolderNode
