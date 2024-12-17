import { useMemo, useContext, useEffect, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { BeobZugeordnetMapIconComponent } from '../components/Projekte/TreeContainer/Tree/Row.jsx'
import { useProjekteTabs } from './useProjekteTabs.js'

// TODO:remove unused
import { TpopIcon100 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/100.jsx'
import { TpopIcon100Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/100Highlighted.jsx'
import { TpopIcon101 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/101.jsx'
import { TpopIcon101Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/101Highlighted.jsx'
import { TpopIcon200 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/200.jsx'
import { TpopIcon200Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/200Highlighted.jsx'
import { TpopIcon201 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/201.jsx'
import { TpopIcon201Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/201Highlighted.jsx'
import { TpopIcon202 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/202.jsx'
import { TpopIcon202Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/202Highlighted.jsx'
import { TpopIcon300 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/300.jsx'
import { TpopIcon300Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/300Highlighted.jsx'
import { TpopIcon } from '../components/Projekte/Karte/layers/Tpop/tpop.jsx'
import { TpopIconHighlighted } from '../components/Projekte/Karte/layers/Tpop/tpopHighlighted.jsx'
import { TpopIconU } from '../components/Projekte/Karte/layers/Tpop/statusGroup/u.jsx'
import { TpopIconUHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/uHighlighted.jsx'
import { TpopIconA } from '../components/Projekte/Karte/layers/Tpop/statusGroup/a.jsx'
import { TpopIconAHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/aHighlighted.jsx'
import { TpopIconP } from '../components/Projekte/Karte/layers/Tpop/statusGroup/p.jsx'
import { TpopIconPHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/pHighlighted.jsx'
import { TpopIconQ } from '../components/Projekte/Karte/layers/Tpop/statusGroup/q.jsx'
import { TpopIconQHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/qHighlighted.jsx'
import { tpopIcons } from './useTpopsNavData.js'

export const useTpopNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const store = useContext(MobxContext)
  const showBeobzugeordnetIcon =
    store.activeApfloraLayers?.includes('beobZugeordnet') && karteIsVisible
  const [, setRerenderer] = useState(0)
  const rerender = useCallback(() => setRerenderer((prev) => prev + 1), [])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeTpop',
      tpopId,
      store.tree.tpopmassnGqlFilterForTree,
      store.tree.tpopmassnberGqlFilterForTree,
      store.tree.ekGqlFilterForTree,
      store.tree.ekfGqlFilterForTree,
      store.tree.tpopberGqlFilterForTree,
      store.tree.beobZugeordnetGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavTpopQuery(
            $tpopId: UUID!
            $tpopmassnFilter: TpopmassnFilter!
            $tpopmassnberFilter: TpopmassnberFilter!
            $tpopfeldkontrFilter: TpopkontrFilter!
            $tpopfreiwkontrFilter: TpopkontrFilter!
            $tpopberFilter: TpopberFilter!
            $beobZugeordnetFilter: BeobFilter!
          ) {
            tpopById(id: $tpopId) {
              id
              label
              status
              tpopmassnsByTpopId {
                totalCount
              }
              filteredTpopmassns: tpopmassnsByTpopId(filter: $tpopmassnFilter) {
                totalCount
              }
              tpopmassnbersByTpopId {
                totalCount
              }
              filteredTpopmassnbers: tpopmassnbersByTpopId(
                filter: $tpopmassnberFilter
              ) {
                totalCount
              }
              tpopfeldkontrs: tpopkontrsByTpopId(
                filter: {
                  typ: { distinctFrom: "Freiwilligen-Erfolgskontrolle" }
                }
              ) {
                totalCount
              }
              filteredTpopfeldkontrs: tpopkontrsByTpopId(
                filter: $tpopfeldkontrFilter
              ) {
                totalCount
              }
              tpopfreiwkontrs: tpopkontrsByTpopId(
                filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
              ) {
                totalCount
              }
              filteredTpopfreiwkontrs: tpopkontrsByTpopId(
                filter: $tpopfreiwkontrFilter
              ) {
                totalCount
              }
              tpopbersByTpopId {
                totalCount
              }
              filteredTpopbers: tpopbersByTpopId(filter: $tpopberFilter) {
                totalCount
              }
              beobZugeordnet: beobsByTpopId(
                filter: { tpopId: { equalTo: $tpopId } }
              ) {
                totalCount
              }
              filteredBeobZugeordnet: beobsByTpopId(
                filter: $beobZugeordnetFilter
              ) {
                totalCount
              }
              tpopFilesByTpopId {
                totalCount
              }
            }
            allTpopHistories(filter: { id: { equalTo: $tpopId } }) {
              totalCount
            }
          }
        `,
        variables: {
          tpopId,
          tpopmassnFilter: store.tree.tpopmassnGqlFilterForTree,
          tpopmassnberFilter: store.tree.tpopmassnberGqlFilterForTree,
          tpopfeldkontrFilter: store.tree.ekGqlFilterForTree,
          tpopfreiwkontrFilter: store.tree.ekfGqlFilterForTree,
          tpopberFilter: store.tree.tpopberGqlFilterForTree,
          beobZugeordnetFilter: {
            ...store.tree.beobZugeordnetGqlFilterForTree,
            tpopId: { equalTo: tpopId },
          },
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () => reaction(() => store.tree.tpopmassnGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.tpopmassnberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.ekGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.ekfGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.tpopberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.beobZugeordnetGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.activeApfloraLayers.slice(), rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.map.tpopIcon, rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.showTpopIcon, rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const label = data?.data?.tpopById?.label
  const status = data?.data?.tpopById?.status
  const massnCount = data?.data?.tpopById?.tpopmassnsByTpopId?.totalCount ?? 0
  const filteredMassnCount =
    data?.data?.tpopById?.filteredTpopmassns?.totalCount ?? 0
  const popmassnbersCount =
    data?.data?.tpopById?.tpopmassnbersByTpopId?.totalCount ?? 0
  const filteredPopmassnbersCount =
    data?.data?.tpopById?.filteredTpopmassnbers?.totalCount ?? 0
  const feldkontrCount = data?.data?.tpopById?.tpopfeldkontrs?.totalCount ?? 0
  const filteredFeldkontrCount =
    data?.data?.tpopById?.filteredTpopfeldkontrs?.totalCount ?? 0
  const freiwkontrCount = data?.data?.tpopById?.tpopfreiwkontrs?.totalCount ?? 0
  const filteredFreiwkontrCount =
    data?.data?.tpopById?.filteredTpopfreiwkontrs?.totalCount ?? 0
  const tpopbersCount = data?.data?.tpopById?.tpopbersByTpopId?.totalCount ?? 0
  const filteredTpopbersCount =
    data?.data?.tpopById?.filteredTpopbers?.totalCount ?? 0
  const beobZugeordnetCount =
    data?.data?.tpopById?.beobZugeordnet?.totalCount ?? 0
  const filteredBeobZugeordnetCount =
    data?.data?.tpopById?.filteredBeobZugeordnet?.totalCount ?? 0
  const filesCount = data?.data?.tpopById?.tpopFilesByTpopId?.totalCount ?? 0
  const historiesCount = data?.data?.allTpopHistories?.totalCount ?? 0

  const tpopIconName = store.map.tpopIcon

  const Icon =
    status ?
      tpopIcons[tpopIconName][status + 'Highlighted']
    : TpopIconQHighlighted

  const navData = useMemo(
    () => ({
      id: tpopId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}`,
      label,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Teil-Population',
          label: `Teil-Population`,
          labelLeftElements: store.tree.showTpopIcon ? [Icon] : undefined,
        },
        {
          id: 'Massnahmen',
          label: `Massnahmen (${isLoading ? '...' : `${filteredMassnCount}/${massnCount}`})`,
        },
        {
          id: 'Massnahmen-Berichte',
          label: `Massnahmen-Berichte (${isLoading ? '...' : `${filteredPopmassnbersCount}/${popmassnbersCount}`})`,
        },
        {
          id: 'Feld-Kontrollen',
          label: `Feld-Kontrollen (${isLoading ? '...' : `${filteredFeldkontrCount}/${feldkontrCount}`})`,
        },
        {
          id: 'Freiwilligen-Kontrollen',
          label: `Freiwilligen-Kontrollen (${isLoading ? '...' : `${filteredFreiwkontrCount}/${freiwkontrCount}`})`,
        },
        {
          id: 'Kontroll-Berichte',
          label: `Kontroll-Berichte (${isLoading ? '...' : `${filteredTpopbersCount}/${tpopbersCount}`})`,
        },
        {
          id: 'Beobachtungen',
          label: `Beobachtungen zugeordnet (${isLoading ? '...' : `${filteredBeobZugeordnetCount}/${beobZugeordnetCount}`})`,
          labelLeftElements:
            showBeobzugeordnetIcon ?
              [BeobZugeordnetMapIconComponent]
            : undefined,
        },
        {
          id: 'EK',
          label: `EK`,
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
      apId,
      beobZugeordnetCount,
      feldkontrCount,
      filesCount,
      filteredBeobZugeordnetCount,
      filteredFeldkontrCount,
      filteredFreiwkontrCount,
      filteredMassnCount,
      filteredPopmassnbersCount,
      filteredTpopbersCount,
      freiwkontrCount,
      historiesCount,
      isLoading,
      label,
      massnCount,
      popId,
      popmassnbersCount,
      projId,
      showBeobzugeordnetIcon,
      tpopId,
      tpopbersCount,
    ],
  )

  return { isLoading, error, navData }
}
