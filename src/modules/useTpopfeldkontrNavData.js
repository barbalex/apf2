import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { StoreContext } from '../storeContext.js'

export const useTpopfeldkontrNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const tpopkontrId = props?.tpopkontrId ?? params.tpopkontrId

  const store = useContext(StoreContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeTpopfeldkontrs',
      tpopkontrId,
      store.tree.tpopkontrzaehlGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavTpopfeldkontrQuery(
            $tpopkontrId: UUID!
            $tpopkontrzaehlFilter: TpopkontrzaehlFilter!
          ) {
            tpopkontrById(id: $tpopkontrId) {
              id
              label: labelEk
              tpopkontrzaehlsByTpopkontrId {
                totalCount
              }
              filteredTpopkontrzaehls: tpopkontrzaehlsByTpopkontrId(
                filter: $tpopkontrzaehlFilter
              ) {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopkontrId,
          tpopkontrzaehlFilter: store.tree.tpopkontrzaehlGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () => reaction(() => store.tree.tpopkontrzaehlGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const label = data?.data?.tpopkontrById?.label
  const tpopkontrzaehlCount =
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopId?.totalCount ?? 0
  const filteredTpopkontrzaehlCount =
    data?.data?.tpopkontrById?.filteredTpopkontrzaehls?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: tpopkontrId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${tpopkontrId}`,
      label,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Zaehlungen',
          label: `Zählungen (${isLoading ? '...' : `${filteredTpopkontrzaehlCount}/${tpopkontrzaehlCount}`})`,
        },
      ],
    }),
    [
      apId,
      filteredTpopkontrzaehlCount,
      isLoading,
      label,
      popId,
      projId,
      tpopId,
      tpopkontrId,
      tpopkontrzaehlCount,
    ],
  )

  return { isLoading, error, navData }
}
