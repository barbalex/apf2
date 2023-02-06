import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { useContext } from 'react'

import Row from '../../../Row'
import storeContext from '../../../../../../../storeContext'

const Apberuebersichts = () => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const apberuebersichtsFilter = {
    projId: { in: ['e57f56f4-4376-11e8-ab21-4314b6749d13'] },
  }
  if (nodeLabelFilter.apberuebersicht) {
    apberuebersichtsFilter.label = {
      includesInsensitive: nodeLabelFilter.apberuebersicht,
    }
  }

  const { data } = useQuery({
    queryKey: ['treeApberuebersicht', apberuebersichtsFilter],
    queryFn: async () =>
      client.query({
        query: gql`
          query TreeApberuebersichtsQuery(
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
          apberuebersichtsFilter,
        },
      }),
  })

  return (data?.data?.allApberuebersichts?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'apberuebersicht',
      id: el.id,
      parentId: el.projId,
      parentTableId: el.projId,
      urlLabel: el.label || '(kein Jahr)',
      label: el.label,
      url: ['Projekte', el.projId, 'AP-Berichte', el.id],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default Apberuebersichts
