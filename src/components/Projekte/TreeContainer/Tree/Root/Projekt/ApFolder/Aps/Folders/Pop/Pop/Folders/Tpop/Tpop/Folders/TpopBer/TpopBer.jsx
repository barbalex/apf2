import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../storeContext'

const TpopBer = ({ projekt, ap, pop, tpop }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const tpopbersFilter = { tpopId: { equalTo: tpop.id } }
  if (nodeLabelFilter.tpopber) {
    tpopbersFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopber,
    }
  }

  const { data } = useQuery({
    queryKey: ['treeTpopber', tpop.id, tpopbersFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeTpopberQuery($id: UUID!, $tpopbersFilter: TpopberFilter!) {
            tpopById(id: $id) {
              id
              tpopbersByTpopId(filter: $tpopbersFilter, orderBy: LABEL_ASC) {
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
          tpopbersFilter,
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.tpopById?.tpopbersByTpopId?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'tpopber',
      parentId: `${tpop.id}TpopberFolder`,
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
        'Kontroll-Berichte',
        el.id,
      ],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(TpopBer)
