import { useMemo, useContext, useEffect, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { BeobzugeordnetMapIcon } from '../components/NavElements/BeobzugeordnetMapIcon.jsx'
import { useProjekteTabs } from './useProjekteTabs.js'

// TODO:remove unused
import { TpopIconQHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/qHighlighted.jsx'
import { tpopIcons } from './useTpopsNavData.js'

import { CopyingComponent } from '../components/Projekte/TreeContainer/Tree/Row.jsx'
import { MovingIcon } from '../components/NavElements/MovingIcon.jsx'

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
  useEffect(
    () => reaction(() => store.moving.id, rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.copying.id, rerender),
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

  const TpopIcon =
    status ?
      tpopIcons[tpopIconName][status + 'Highlighted']
    : TpopIconQHighlighted

  const labelRightElements = useMemo(() => {
    const labelRightElements = []
    const isMoving = store.moving.id === tpopId
    if (isMoving) {
      labelRightElements.push(MovingIcon)
    }
    const isCopying = store.copying.id === tpopId
    if (isCopying) {
      labelRightElements.push(CopyingComponent)
    }

    return labelRightElements
  }, [store.moving.id, store.copying.id, tpopId])

  const navData = useMemo(
    () => ({
      id: tpopId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}`,
      label,
      labelLeftElements: store.tree.showTpopIcon ? [TpopIcon] : undefined,
      labelRightElements:
        labelRightElements.length ? labelRightElements : undefined,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Teil-Population',
          label: `Teil-Population`,
          labelLeftElements: store.tree.showTpopIcon ? [TpopIcon] : undefined,
          labelRightElements:
            labelRightElements.length ? labelRightElements : undefined,
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
            showBeobzugeordnetIcon ? [BeobzugeordnetMapIcon] : undefined,
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
      TpopIcon,
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
      labelRightElements,
      massnCount,
      popId,
      popmassnbersCount,
      projId,
      showBeobzugeordnetIcon,
      store.tree.showTpopIcon,
      tpopId,
      tpopbersCount,
    ],
  )

  return { isLoading, error, navData }
}
