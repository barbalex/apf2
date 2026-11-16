import { useEffect, useRef } from 'react'
import { useAtomValue, useStore } from 'jotai'
import type { Store } from 'jotai'
import { useSearchParams } from 'react-router'

import {
  mapActiveApfloraLayersAtom,
  mapActiveBaseLayerAtom,
  mapActiveOverlaysAtom,
  mapPopIconAtom,
  mapPopLabelAtom,
  mapShowApfLayersForMultipleApsAtom,
  mapTpopIconAtom,
  mapTpopLabelAtom,
} from '../../../store/index.ts'
import {
  readMapLayersFromSearchParams,
  writeMapLayersToSearchParams,
} from '../../../modules/mapLayersSearchParam.ts'
import type { MapLayersState } from '../../../modules/mapLayersSearchParam.ts'

const getLayersState = (targetStore: Store): MapLayersState => ({
  overlays: targetStore.get(mapActiveOverlaysAtom),
  apfloraLayers: targetStore.get(mapActiveApfloraLayersAtom),
  baseLayer: targetStore.get(mapActiveBaseLayerAtom),
  popIcon: targetStore.get(mapPopIconAtom),
  tpopIcon: targetStore.get(mapTpopIconAtom),
  popLabel: targetStore.get(mapPopLabelAtom),
  tpopLabel: targetStore.get(mapTpopLabelAtom),
  showApfLayersForMultipleAps: targetStore.get(
    mapShowApfLayersForMultipleApsAtom,
  ),
})

/**
 * keeps the map layer and symbology state completely in the url:
 * on mount, url params win over the stored values (a shared link opens
 * the shared map); afterwards every change is written back through the
 * router with replace. Toggles are user-click frequency and Karte
 * re-renders on these atoms anyway — the url write adds no renders of
 * the map itself. Reads window.location like Karte does: in the tree2
 * pane this resolves to the main url, whose params buildTree2Path
 * forwarded into the pane's initial entry.
 */
export const MapLayersUrlSync = () => {
  const [, setSearchParams] = useSearchParams()
  const targetStore = useStore()

  const overlays = useAtomValue(mapActiveOverlaysAtom)
  const apfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const baseLayer = useAtomValue(mapActiveBaseLayerAtom)
  const popIcon = useAtomValue(mapPopIconAtom)
  const tpopIcon = useAtomValue(mapTpopIconAtom)
  const popLabel = useAtomValue(mapPopLabelAtom)
  const tpopLabel = useAtomValue(mapTpopLabelAtom)
  const showApfLayersForMultipleAps = useAtomValue(
    mapShowApfLayersForMultipleApsAtom,
  )

  const firstChangeRun = useRef(true)

  // on mount: url params win over the stored values, then complete the
  // url with the now-effective state (read from the store because this
  // render's subscribed values are pre-seed)
  useEffect(() => {
    const fromUrl = readMapLayersFromSearchParams(
      new URLSearchParams(window.location.search),
    )
    if (fromUrl.overlays !== undefined) {
      targetStore.set(mapActiveOverlaysAtom, fromUrl.overlays)
    }
    if (fromUrl.apfloraLayers !== undefined) {
      targetStore.set(mapActiveApfloraLayersAtom, fromUrl.apfloraLayers)
    }
    if (fromUrl.baseLayer !== undefined) {
      targetStore.set(mapActiveBaseLayerAtom, fromUrl.baseLayer)
    }
    if (fromUrl.popIcon !== undefined) {
      targetStore.set(mapPopIconAtom, fromUrl.popIcon)
    }
    if (fromUrl.tpopIcon !== undefined) {
      targetStore.set(mapTpopIconAtom, fromUrl.tpopIcon)
    }
    if (fromUrl.popLabel !== undefined) {
      targetStore.set(mapPopLabelAtom, fromUrl.popLabel)
    }
    if (fromUrl.tpopLabel !== undefined) {
      targetStore.set(mapTpopLabelAtom, fromUrl.tpopLabel)
    }
    if (fromUrl.showApfLayersForMultipleAps !== undefined) {
      targetStore.set(
        mapShowApfLayersForMultipleApsAtom,
        fromUrl.showApfLayersForMultipleAps,
      )
    }
    setSearchParams(
      (prev) => writeMapLayersToSearchParams(prev, getLayersState(targetStore)),
      { replace: true },
    )
  }, [targetStore, setSearchParams])

  // keep the url complete after every change. Its first run happens in
  // the same commit as the mount effect above, with pre-seed (stale)
  // subscribed values — skip exactly that one run
  useEffect(() => {
    if (firstChangeRun.current) {
      firstChangeRun.current = false
      return
    }
    setSearchParams(
      (prev) =>
        writeMapLayersToSearchParams(prev, {
          overlays,
          apfloraLayers,
          baseLayer,
          popIcon,
          tpopIcon,
          popLabel,
          tpopLabel,
          showApfLayersForMultipleAps,
        }),
      { replace: true },
    )
  }, [
    overlays,
    apfloraLayers,
    baseLayer,
    popIcon,
    tpopIcon,
    popLabel,
    tpopLabel,
    showApfLayersForMultipleAps,
    setSearchParams,
  ])

  return null
}
