import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gql, useApolloClient } from '@apollo/client'

import Row from '../../../Row'
import storeContext from '../../../../../../../storeContext'

const ApberrelevantGrundNodes = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const apberrelevantGrundWertesFilter =
    nodeLabelFilter.tpopApberrelevantGrundWerte
      ? {
          label: {
            includesInsensitive: nodeLabelFilter.tpopApberrelevantGrundWerte,
          },
        }
      : { id: { isNull: false } }

  const { data } = useQuery({
    queryKey: [
      'treeTpopApberrelevantGrundWerte',
      apberrelevantGrundWertesFilter,
    ],
    queryFn: async () =>
      client.query({
        query: gql`
          query TreeApberrelevantGrundWerteQuery(
            $apberrelevantGrundWertesFilter: TpopApberrelevantGrundWerteFilter!
          ) {
            allTpopApberrelevantGrundWertes(
              filter: $apberrelevantGrundWertesFilter
              orderBy: SORT_ASC
            ) {
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: {
          apberrelevantGrundWertesFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  const nodes = (data?.data?.allTpopApberrelevantGrundWertes?.nodes ?? []).map(
    (el) => ({
      nodeType: 'table',
      menuType: 'tpopApberrelevantGrundWerte',
      id: el.id,
      parentId: 'tpopApberrelevantGrundWerteFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'ApberrelevantGrundWerte', el.id],
      hasChildren: false,
    }),
  )

  if (!nodes.length) return null

  return nodes.map((node) => <Row key={node.id} node={node} />)
}

export default ApberrelevantGrundNodes
