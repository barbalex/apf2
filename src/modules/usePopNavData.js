import { useMemo, useContext, useEffect, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import PopSvg100Svg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/100.svg'
import PopSvg100HighlightedSvg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/100Highlighted.svg'
import PopSvg101Svg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/101.svg'
import PopSvg101HighlightedSvg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/101Highlighted.svg'
import PopSvg200Svg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/200.svg'
import PopSvg200HighlightedSvg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/200Highlighted.svg'
import PopSvg201Svg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/201.svg'
import PopSvg201HighlightedSvg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/201Highlighted.svg'
import PopSvg202Svg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/202.svg'
import PopSvg202HighlightedSvg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/202Highlighted.svg'
import PopSvg300Svg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/300.svg'
import PopSvg300HighlightedSvg from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/300Highlighted.svg'
import PopIconSvgSvg from '../components/Projekte/Karte/layers/Pop/pop.svg'
import PopIconHighlightedSvg from '../components/Projekte/Karte/layers/Pop/popHighlighted.svg'
import PopUIconSvg from '../components/Projekte/Karte/layers/Pop/statusGroup/u.svg'
import PopUIconHighlightedSvg from '../components/Projekte/Karte/layers/Pop/statusGroup/uHighlighted.svg'
import PopAIconSvg from '../components/Projekte/Karte/layers/Pop/statusGroup/a.svg'
import PopAIconHighlightedSvg from '../components/Projekte/Karte/layers/Pop/statusGroup/aHighlighted.svg'
import PopPIconSvg from '../components/Projekte/Karte/layers/Pop/statusGroup/p.svg'
import PopPIconHighlightedSvg from '../components/Projekte/Karte/layers/Pop/statusGroup/pHighlighted.svg'
import PopQIconSvg from '../components/Projekte/Karte/layers/Pop/statusGroup/q.svg'
import PopQIconHighlightedSvg from '../components/Projekte/Karte/layers/Pop/statusGroup/qHighlighted.svg'
import { IconContainer } from '../components/Projekte/TreeContainer/Tree/Row.jsx'

import { MobxContext } from '../mobxContext.js'
import { TpopMapIconComponent } from '../components/Projekte/TreeContainer/Tree/Row.jsx'
import { useProjekteTabs } from './useProjekteTabs.js'

export const usePopNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const store = useContext(MobxContext)

  const showTpopIcon =
    store.activeApfloraLayers?.includes('tpop') && karteIsVisible

  const [, setRerenderer] = useState(0)
  const rerender = useCallback(() => setRerenderer((prev) => prev + 1), [])

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
              status
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
              popFilesByPopId {
                totalCount
              }
            }
            allPopHistories(filter: { id: { equalTo: $popId } }) {
              totalCount
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
  useEffect(
    () => reaction(() => store.activeApfloraLayers.slice(), rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const label = data?.data?.popById?.label
  const status = data?.data?.popById?.status
  const tpopsCount = data?.data?.popById?.tpopsByPopId?.totalCount ?? 0
  const filteredTpopsCount = data?.data?.popById?.filteredTpops?.totalCount ?? 0
  const popbersCount = data?.data?.popById?.popbersByPopId?.totalCount ?? 0
  const filteredPopbersCount =
    data?.data?.popById?.filteredPopbers?.totalCount ?? 0
  const popmassnbersCount =
    data?.data?.popById?.popmassnbersByPopId?.totalCount ?? 0
  const filteredPopmassnbersCount =
    data?.data?.popById?.filteredPopmassnbers?.totalCount ?? 0
  const filesCount = data?.data?.popById?.popFilesByPopId?.totalCount ?? 0
  const historiesCount = data?.data?.allPopHistories?.totalCount ?? 0

  const popIconIsHighlighted =
    karteIsVisible && store.activeApfloraLayers.includes('pop')

  const navData = useMemo(
    () => ({
      id: popId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}`,
      label,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Population',
          label: `Population`,
        },
        {
          id: 'Teil-Populationen',
          label: `Teil-Populationen (${isLoading ? '...' : `${filteredTpopsCount}/${tpopsCount}`})`,
          count: tpopsCount,
          labelLeftElements: showTpopIcon ? [TpopMapIconComponent] : undefined,
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
        {
          id: 'Auswertung',
          label: `Auswertung`,
        },
        {
          id: 'Dateien',
          label: `Dateien (${filesCount})`,
          count: filesCount,
        },
        {
          id: 'Historien',
          label: `Historien (${historiesCount})`,
          count: historiesCount,
        },
      ],
    }),
    [
      popId,
      projId,
      apId,
      label,
      isLoading,
      filteredTpopsCount,
      tpopsCount,
      showTpopIcon,
      filteredPopbersCount,
      popbersCount,
      filteredPopmassnbersCount,
      popmassnbersCount,
      filesCount,
      historiesCount,
    ],
  )

  return { isLoading, error, navData }
}
