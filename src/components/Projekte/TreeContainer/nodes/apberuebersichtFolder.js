import { gql } from '@apollo/client'

const apberuebersichtFolderNode = async ({
  projId,
  store,
  treeQueryVariables,
}) => {
  const { client } = store

  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.apberuebersicht ?? ''

  const { data, loading } = await client.query({
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

export default apberuebersichtFolderNode
