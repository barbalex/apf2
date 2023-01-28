import { gql } from '@apollo/client'

import apberuersicht from './apberuebersicht'

const apberuebersichtFolderNode = async ({
  projId,
  store,
  treeQueryVariables,
}) => {
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.apberuebersicht ?? ''

  const { data, loading } = await store.client.query({
    query: gql`
      query TreeApberuebersichtsFolderQuery(
        $apberuebersichtsFilter: ApberuebersichtFilter!
      ) {
        allApberuebersichts(filter: $apberuebersichtsFilter) {
          totalCount
        }
      }
    `,
    variables: {
      apberuebersichtsFilter: treeQueryVariables.apberuebersichtsFilter,
    },
  })

  const count = data?.allApberuebersichts?.totalCount ?? 0

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const showChildren =
    store.tree.openNodes.filter(
      (n) => n[0] === 'Projekte' && n[1] === projId && n[2] === 'AP-Berichte',
    ).length > 0

  if (!showChildren) {
    return {
      menuType: 'apberuebersichtFolder',
      filterTable: 'apberuebersicht',
      id: `${projId}ApberuebersichtsFolder`,
      tableId: projId,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${message})`,
      url: ['Projekte', projId, 'AP-Berichte'],
      hasChildren: count > 0,
    }
  }

  const children = await apberuersicht({ store, treeQueryVariables })

  return {
    menuType: 'apberuebersichtFolder',
    filterTable: 'apberuebersicht',
    id: `${projId}ApberuebersichtsFolder`,
    tableId: projId,
    urlLabel: 'AP-Berichte',
    label: `AP-Berichte (${message})`,
    url: ['Projekte', projId, 'AP-Berichte'],
    hasChildren: count > 0,
    children,
  }
}

export default apberuebersichtFolderNode
