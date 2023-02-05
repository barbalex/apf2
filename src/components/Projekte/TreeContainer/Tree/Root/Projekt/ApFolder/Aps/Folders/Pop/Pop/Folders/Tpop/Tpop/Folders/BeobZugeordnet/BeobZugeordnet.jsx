import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../storeContext'

const BeobZugeordnet = ({ projekt, ap, pop, tpop }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { beobGqlFilterForTree } = store.tree

  const { data } = useQuery({
    queryKey: [
      'treeBeobZugeordnet',
      tpop.id,
      beobGqlFilterForTree('zugeordnet'),
    ],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeBeobZugeordnetQuery(
            $id: UUID!
            $beobZugeordnetsFilter: BeobFilter!
          ) {
            tpopById(id: $id) {
              id
              beobsByTpopId(
                filter: $beobZugeordnetsFilter
                orderBy: [DATUM_DESC, AUTOR_ASC]
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
          beobZugeordnetsFilter: beobGqlFilterForTree('zugeordnet'),
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.tpopById?.beobsByTpopId?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'beobZugeordnet',
      id: el.id,
      parentId: `${tpop.id}BeobZugeordnetFolder`,
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
        'Beobachtungen',
        el.id,
      ],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(BeobZugeordnet)
