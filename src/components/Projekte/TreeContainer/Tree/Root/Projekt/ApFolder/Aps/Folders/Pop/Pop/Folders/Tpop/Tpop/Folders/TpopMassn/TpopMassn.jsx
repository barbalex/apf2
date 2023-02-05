import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../storeContext'

const TpopMassn = ({ projekt, ap, pop, tpop }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { tpopmassnGqlFilterForTree } = store.tree

  const { data } = useQuery({
    queryKey: ['treeTpopmassn', tpop.id, tpopmassnGqlFilterForTree],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeTpopmassnQuery(
            $id: UUID!
            $tpopmassnsFilter: TpopmassnFilter!
          ) {
            tpopById(id: $id) {
              id
              tpopmassnsByTpopId(
                filter: $tpopmassnsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
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
          tpopmassnsFilter: tpopmassnGqlFilterForTree,
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.tpopById?.tpopmassnsByTpopId?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'tpopmassn',
      id: el.id,
      parentId: tpop.id,
      parentTableId: tpop.id,
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
        'Massnahmen',
        el.id,
      ],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(TpopMassn)
