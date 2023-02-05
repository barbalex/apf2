import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../../../storeContext'

const TpopFeldkontrzaehl = ({ projekt, ap, pop, tpop, tpopkontr }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const tpopkontrzaehlsFilter = {
    tpopkontrId: { equalTo: tpopkontr.id },
  }
  if (nodeLabelFilter.tpopkontrzaehl) {
    tpopkontrzaehlsFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopkontrzaehl,
    }
  }

  const { data } = useQuery({
    queryKey: ['treeTpopfeldkontrzaehl', tpopkontr.id, tpopkontrzaehlsFilter],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeTpopfeldkontrzaehlQuery(
            $id: UUID!
            $tpopkontrzaehlsFilter: TpopkontrzaehlFilter!
          ) {
            tpopkontrById(id: $id) {
              id
              tpopkontrzaehlsByTpopkontrId(
                filter: $tpopkontrzaehlsFilter
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
          id: tpopkontr.id,
          tpopkontrzaehlsFilter,
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  return (
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
  ).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'tpopfeldkontrzaehl',
      id: el.id,
      parentId: `${tpopkontr.id}TpopfeldkontrzaehlFolder`,
      parentTableId: tpopkontr.id,
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
        'Feld-Kontrollen',
        tpopkontr.id,
        'Zaehlungen',
        el.id,
      ],
      hasChildren: false,
    }

    return <Row key={el.id} node={node} />
  })
}

export default observer(TpopFeldkontrzaehl)
