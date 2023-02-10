import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../../../../../../../../../../storeContext'
import TpopMassn from './TpopMassn'
import TpopMassnBer from './TpopMassnBer'
import TpopFeldkontr from './TpopFeldkontr'
import TpopFreiwkontr from './TpopFreiwkontr'
import TpopBer from './TpopBer'
import BeobZugeordnet from './BeobZugeordnet'

const TpopFolders = ({ projekt, ap, pop, tpop }) => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const {
    tpopmassnGqlFilterForTree,
    ekGqlFilterForTree,
    ekfGqlFilterForTree,
    beobGqlFilterForTree,
    nodeLabelFilter,
  } = store.tree

  const tpopmassnbersFilter = { tpopId: { equalTo: tpop.id } }
  if (nodeLabelFilter.tpopmassnber) {
    tpopmassnbersFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopmassnber,
    }
  }

  const tpopbersFilter = { tpopId: { equalTo: tpop.id } }
  if (nodeLabelFilter.tpopber) {
    tpopbersFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopber,
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: [
      'treeTpopFolders',
      tpop.id,
      tpopmassnGqlFilterForTree,
      tpopmassnbersFilter,
      tpopbersFilter,
      ekGqlFilterForTree,
      ekfGqlFilterForTree,
      beobGqlFilterForTree,
    ],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeTpopQuery(
            $id: UUID!
            $tpopmassnsFilter: TpopmassnFilter!
            $tpopmassnbersFilter: TpopmassnberFilter!
            $tpopbersFilter: TpopberFilter!
            $tpopfeldkontrsFilter: TpopkontrFilter!
            $tpopfreiwkontrsFilter: TpopkontrFilter!
            $beobZugeordnetsFilter: BeobFilter!
          ) {
            tpopById(id: $id) {
              id
              tpopmassnsByTpopId(filter: $tpopmassnsFilter) {
                totalCount
              }
              tpopmassnbersByTpopId(filter: $tpopmassnbersFilter) {
                totalCount
              }
              tpopbersByTpopId(filter: $tpopbersFilter) {
                totalCount
              }
              tpopfeldkontrs: tpopkontrsByTpopId(
                filter: $tpopfeldkontrsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                totalCount
              }
              tpopfreiwkontrs: tpopkontrsByTpopId(
                filter: $tpopfreiwkontrsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                totalCount
              }
              beobsByTpopId(filter: $beobZugeordnetsFilter) {
                totalCount
              }
            }
          }
        `,
        variables: {
          id: tpop.id,
          tpopmassnsFilter: tpopmassnGqlFilterForTree,
          tpopmassnbersFilter,
          tpopbersFilter,
          tpopfeldkontrsFilter: ekGqlFilterForTree,
          tpopfreiwkontrsFilter: ekfGqlFilterForTree,
          beobZugeordnetsFilter: beobGqlFilterForTree('zugeordnet'),
        },
        fetchPolicy: 'no-cache',
      }),
  })
  const tpopmassnCount =
    data?.data?.tpopById?.tpopmassnsByTpopId?.totalCount ?? 0
  const tpopmassnberCount =
    data?.data?.tpopById?.tpopmassnbersByTpopId?.totalCount ?? 0
  const tpopfeldkontrCount =
    data?.data?.tpopById?.tpopfeldkontrs?.totalCount ?? 0
  const tpopfreiwkontrCount =
    data?.data?.tpopById?.tpopfreiwkontrs?.totalCount ?? 0
  const tpopberCount = data?.data?.tpopById?.tpopbersByTpopId?.totalCount ?? 0
  const beobZugeordnetCount =
    data?.data?.tpopById?.beobsByTpopId?.totalCount ?? 0

  // console.log('Tree TPopFolders', { ekGqlFilterForTree, ekfGqlFilterForTree })

  return (
    <>
      <TpopMassn
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        isLoading={isLoading}
        count={tpopmassnCount}
      />
      <TpopMassnBer
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        isLoading={isLoading}
        count={tpopmassnberCount}
      />
      <TpopFeldkontr
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        isLoading={isLoading}
        count={tpopfeldkontrCount}
      />
      <TpopFreiwkontr
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        isLoading={isLoading}
        count={tpopfreiwkontrCount}
      />
      <TpopBer
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        isLoading={isLoading}
        count={tpopberCount}
      />
      <BeobZugeordnet
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        isLoading={isLoading}
        count={beobZugeordnetCount}
      />
    </>
  )
}

export default observer(TpopFolders)
