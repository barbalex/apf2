import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../storeContext'

const TpopMassnBer = ({ projekt, ap, pop, tpop }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const tpopmassnbersFilter = { tpopId: { equalTo: tpop.id } }
  if (nodeLabelFilter.tpopmassnber) {
    tpopmassnbersFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopmassnber,
    }
  }

  const { data } = useQuery({
    queryKey: ['treeTpopmassnber', tpop.id, tpopmassnbersFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeTpopmassnBerQuery(
            $id: UUID!
            $tpopmassnbersFilter: TpopmassnberFilter!
          ) {
            tpopById(id: $id) {
              id
              tpopmassnbersByTpopId(
                filter: $tpopmassnbersFilter
                orderBy: LABEL_ASC
              ) {
                nodes {
                  id
                  label
                }
              }
            }
          }
        `,
        variables: {
          id: tpop.id,
          tpopmassnbersFilter,
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.tpopById?.tpopmassnbersByTpopId?.nodes ?? []).map(
    (el) => {
      const node = {
        nodeType: 'table',
        menuType: 'tpopmassnber',
        parentId: tpop.id,
        parentTableId: tpop.id,
        id: el.id,
        urlLabel: el.id,
        label: el.label,
        url: [
          'Projekte',
          projekt.id,
          'Arten',
          ap.id,
          'Populationen',
          pop.id,
          'Teil-Populationen',
          tpop.id,
          'Massnahmen-Berichte',
          el.id,
        ],
        hasChildren: false,
      }

      return <Row key={el.id} node={node} />
    },
  )
}

export default observer(TpopMassnBer)
