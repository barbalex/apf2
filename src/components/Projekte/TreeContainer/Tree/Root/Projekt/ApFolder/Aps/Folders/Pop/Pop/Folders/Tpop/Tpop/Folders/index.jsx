import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../../../../../../../../../../storeContext'
import TPopMassn from './TPopMassn'
import TPopMassnBer from './TPopMassnBer'
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

  console.log('TpopFolders', { tpopmassnCount, tpopId: tpop.id })

  return (
    <>
      <TPopMassn
        key={`${tpop.id}TPopMassnF`}
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        isLoading={isLoading}
        count={tpopmassnCount}
      />
      <TPopMassnBer
        key={`${tpop.id}TPopMassnBerF`}
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        isLoading={isLoading}
        count={tpopmassnberCount}
      />
      <TpopFeldkontr
        key={`${tpop.id}TPopFeldkontrF`}
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        isLoading={isLoading}
        count={tpopfeldkontrCount}
      />
      <TpopFreiwkontr
        key={`${tpop.id}TPopFreiwkontrF`}
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        isLoading={isLoading}
        count={tpopfreiwkontrCount}
      />
      <TpopBer
        key={`${tpop.id}TPopBerF`}
        projekt={projekt}
        ap={ap}
        pop={pop}
        tpop={tpop}
        isLoading={isLoading}
        count={tpopberCount}
      />
      <BeobZugeordnet
        key={`${tpop.id}TPopBeobZugeordnetF`}
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
