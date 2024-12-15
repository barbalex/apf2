import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'

export const useTpopfreiwkontrNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const tpopkontrId = props?.tpopkontrId ?? params.tpopkontrId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeTpopfreiwkontr',
      tpopkontrId,
      store.tree.tpopkontrzaehlGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavTpopfreiwkontrQuery(
            $tpopkontrId: UUID!
            $tpopkontrzaehlFilter: TpopkontrzaehlFilter!
          ) {
            tpopkontrById(id: $tpopkontrId) {
              id
              label: labelEkf
              tpopkontrzaehlsByTpopkontrId {
                totalCount
              }
              tpopkontrFilesByTpopkontrId {
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
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.totalCount ?? 0
  const filteredTpopkontrzaehlCount =
    data?.data?.tpopkontrById?.filteredTpopkontrzaehls?.totalCount ?? 0
  const filesCount =
    data?.data?.tpopkontrById?.tpopkontrFilesByTpopkontrId?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: tpopkontrId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen/${tpopkontrId}`,
      label,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Freiwilligen-Kontrolle',
          label: `Freiwilligen-Kontrolle`,
        },
        {
          id: 'Zaehlungen',
          label: `Zählungen (${isLoading ? '...' : `${filteredTpopkontrzaehlCount}/${tpopkontrzaehlCount}`})`,
        },
        {
          id: 'Dateien',
          label: `Dateien (${filesCount})`,
          count: filesCount,
        },
      ],
    }),
    [
      apId,
      filesCount,
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
