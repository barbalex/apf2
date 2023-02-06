import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../../storeContext'
import ZaehlFolder from './Zaehl'

const TpopFreiwkontr = ({ projekt, ap, pop, tpop }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { ekfGqlFilterForTree } = store.tree

  const { data } = useQuery({
    queryKey: ['treeTpopfreiwkontr', tpop.id, ekfGqlFilterForTree],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeTpopfreiwkontrQuery(
            $id: UUID!
            $tpopfreiwkontrsFilter: TpopkontrFilter!
          ) {
            tpopById(id: $id) {
              id
              tpopfreiwkontrs: tpopkontrsByTpopId(
                filter: $tpopfreiwkontrsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                nodes {
                  id
                  labelEkf
                }
              }
            }
          }
        `,
        variables: {
          id: tpop.id,
          tpopfreiwkontrsFilter: ekfGqlFilterForTree,
        },
        // without 'network-only' or using tanstack,
        // ui does not update when inserting and deleting
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.tpopById?.tpopfreiwkontrs?.nodes ?? []).map((el) => {
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
          n[8] === 'Freiwilligen-Kontrollen' &&
          n[9] === el.id,
      ).length > 0

    const node = {
      nodeType: 'table',
      menuType: 'tpopfreiwkontr',
      id: el.id,
      tableId: el.id,
      parentId: `${tpop.id}TpopfreiwkontrFolder`,
      parentTableId: tpop.id,
      urlLabel: el.id,
      label: el.labelEkf,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
        tpop.id,
        'Freiwilligen-Kontrollen',
        el.id,
      ],
      hasChildren: true,
    }

    return (
      <div key={el.id}>
        <Row node={node} />
        {isOpen && (
          <ZaehlFolder
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            tpopkontr={el}
          />
        )}
      </div>
    )
  })
}

export default observer(TpopFreiwkontr)
