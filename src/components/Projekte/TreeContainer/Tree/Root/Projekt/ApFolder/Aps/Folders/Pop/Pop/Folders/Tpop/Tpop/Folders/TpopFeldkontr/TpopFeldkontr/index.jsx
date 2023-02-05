import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../../storeContext'
import ZaehlFolder from './Zaehl'

const TpopFeldkontr = ({ projekt, ap, pop, tpop }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { ekGqlFilterForTree } = store.tree

  const { data } = useQuery({
    queryKey: ['treeTpopfeldkontr', tpop.id, ekGqlFilterForTree],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeTpopfeldkontrQuery(
            $id: UUID!
            $tpopfeldkontrsFilter: TpopkontrFilter!
          ) {
            tpopById(id: $id) {
              id
              tpopfeldkontrs: tpopkontrsByTpopId(
                filter: $tpopfeldkontrsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                nodes {
                  id
                  labelEk
                }
              }
            }
          }
        `,
        variables: {
          id: tpop.id,
          tpopfeldkontrsFilter: ekGqlFilterForTree,
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.tpopById?.tpopfeldkontrs?.nodes ?? []).map((el) => {
    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 5 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === pop.id &&
          n[6] === 'Teil-Populationen' &&
          n[7] === tpop.id &&
          n[8] === 'Feld-Kontrollen' &&
          n[9] === el.id,
      ).length > 0

    const node = {
      nodeType: 'table',
      menuType: 'tpopfeldkontr',
      id: el.id,
      parentId: `${tpop.id}TpopfeldkontrFolder`,
      parentTableId: tpop.id,
      urlLabel: el.id,
      label: el.labelEk,
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
        el.id,
      ],
      hasChildren: true,
    }

    return (
      <>
        <Row key={el.id} node={node} />
        {isOpen && (
          <ZaehlFolder
            key={`${tpop.id}TPopFeldkontrZaehlFolderZaehls`}
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            tpopkontr={el}
          />
        )}
      </>
    )
  })
}

export default observer(TpopFeldkontr)
