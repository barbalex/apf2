import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { StoreContext } from '../storeContext.js'

export const usePopNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId

  const store = useContext(StoreContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treePop',
      popId,
      store.tree.tpopGqlFilterForTree,
      store.tree.popberGqlFilterForTree,
      store.tree.popmassnberGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavPopQuery(
            $popId: UUID!
            $tpopFilter: TpopFilter!
            $popberFilter: PopberFilter!
            $popmassnberFilter: PopmassnberFilter!
          ) {
            popById(id: $popId) {
              id
              label
              tpopsByPopId {
                totalCount
              }
              filteredTpops: tpopsByPopId(filter: $tpopFilter) {
                totalCount
              }
              popbersByPopId {
                totalCount
              }
              filteredPopbers: popbersByPopId(filter: $popberFilter) {
                totalCount
              }
              popmassnbersByPopId {
                totalCount
              }
              filteredPopmassnbers: popmassnbersByPopId(
                filter: $popmassnberFilter
              ) {
                totalCount
              }
            }
          }
        `,
        variables: {
          popId,
          tpopFilter: store.tree.tpopGqlFilterForTree,
          popberFilter: store.tree.popberGqlFilterForTree,
          popmassnberFilter: store.tree.popmassnberGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () => reaction(() => store.tree.tpopGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.popberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.popmassnberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const label = data?.data?.popById?.label
  const tpopsCount = data?.data?.popById?.tpopsByPopId?.totalCount ?? 0
  const filteredTpopsCount = data?.data?.popById?.filteredTpops?.totalCount ?? 0
  const popbersCount = data?.data?.popById?.popbersByPopId?.totalCount ?? 0
  const filteredPopbersCount =
    data?.data?.popById?.filteredPopbers?.totalCount ?? 0
  const popmassnbersCount =
    data?.data?.popById?.popmassnbersByPopId?.totalCount ?? 0
  const filteredPopmassnbersCount =
    data?.data?.popById?.filteredPopmassnbers?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: popId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}`,
      label,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Teil-Populationen',
          label: `Teil-Populationen (${isLoading ? '...' : `${filteredTpopsCount}/${tpopsCount}`})`,
          count: tpopsCount,
        },
        {
          id: 'Kontroll-Berichte',
          label: `Kontroll-Berichte (${isLoading ? '...' : `${filteredPopbersCount}/${popbersCount}`})`,
          count: popbersCount,
        },
        {
          id: 'Massnahmen-Berichte',
          label: `Massnahmen-Berichte (${isLoading ? '...' : `${filteredPopmassnbersCount}/${popmassnbersCount}`})`,
          count: popmassnbersCount,
        },
      ],
    }),
    [
      apId,
      filteredPopbersCount,
      filteredPopmassnbersCount,
      filteredTpopsCount,
      isLoading,
      label,
      popbersCount,
      popId,
      popmassnbersCount,
      projId,
      tpopsCount,
    ],
  )

  return { isLoading, error, navData }
}
