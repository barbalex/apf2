import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'

import Row from '../../../Row'

const Apberuebersichts = ({  apberuebersichtsFilter }) => {
  const client = useApolloClient()
  const { data } = useQuery({
    queryKey: ['treeApberuebersichts', apberuebersichtsFilter],
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

  const nodes = (data?.data?.allApberuebersichts?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'apberuebersicht',
    id: el.id,
    parentId: el.projId,
    parentTableId: el.projId,
    urlLabel: el.label || '(kein Jahr)',
    label: el.label,
    url: ['Projekte', el.projId, 'AP-Berichte', el.id],
    hasChildren: false,
  }))

  return nodes.map((node) => <Row key={node.id} node={node} />)
}

export default observer(Apberuebersichts)
