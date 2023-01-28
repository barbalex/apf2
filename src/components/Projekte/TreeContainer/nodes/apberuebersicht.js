import { gql } from '@apollo/client'

const apberuebersichtNodes = async ({ store, treeQueryVariables }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeApberuebersichtsFolderQuery(
        $apberuebersichtsFilter: ApberuebersichtFilter!
      ) {
        allApberuebersichts(
          filter: $apberuebersichtsFilter
          orderBy: LABEL_ASC
        ) {
          nodes {
            id
            projId
            label
          }
        }
      }
    `,
    variables: {
      apberuebersichtsFilter: treeQueryVariables.apberuebersichtsFilter,
    },
  })

  const nodes = (data?.allApberuebersichts?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'apberuebersicht',
    filterTable: 'apberuebersicht',
    id: el.id,
    parentId: el.projId,
    parentTableId: el.projId,
    urlLabel: el.label || '(kein Jahr)',
    label: el.label,
    url: ['Projekte', el.projId, 'AP-Berichte', el.id],
    hasChildren: false,
  }))

  return nodes
}

export default apberuebersichtNodes
