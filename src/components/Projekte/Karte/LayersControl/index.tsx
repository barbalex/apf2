import { useState, useEffect, useRef } from 'react'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { useAtomValue } from 'jotai'

import { Overlays } from './Overlays.tsx'
import { ApfloraLayers } from './ApfloraLayers/index.tsx'
import { BaseLayers } from './BaseLayers/index.tsx'
import {
  mapApfloraLayersAtom,
  mapOverlaysAtom,
} from '../../../../store/index.ts'

import styles from './index.module.css'

export const LayersControl = () => {
  const overlays = useAtomValue(mapOverlaysAtom)
  const apfloraLayers = useAtomValue(mapApfloraLayersAtom)

  const [baseLayersExpanded, setBaseLayersExpanded] = useState(true)
  const [overlaysExpanded, setOverlaysExpanded] = useState(false)
  const [apfloraLayersExpanded, setApfloraLayersExpanded] = useState(false)

  const onToggleBaseLayersExpanded = (event) => {
    event.stopPropagation()
    setBaseLayersExpanded(!baseLayersExpanded)
    if (overlaysExpanded) {
      setOverlaysExpanded(!overlaysExpanded)
    }
    if (apfloraLayersExpanded) {
      setApfloraLayersExpanded(!apfloraLayersExpanded)
    }
  }

  const onToggleOverlaysExpanded = () => {
    setOverlaysExpanded(!overlaysExpanded)
    if (baseLayersExpanded) {
      setBaseLayersExpanded(!baseLayersExpanded)
    }
    if (apfloraLayersExpanded) {
      setApfloraLayersExpanded(!apfloraLayersExpanded)
    }
  }

  const onToggleApfloraLayersExpanded = () => {
    setApfloraLayersExpanded(!apfloraLayersExpanded)
    if (overlaysExpanded) {
      setOverlaysExpanded(!overlaysExpanded)
    }
    if (baseLayersExpanded) {
      setBaseLayersExpanded(!baseLayersExpanded)
    }
  }

  const apfloraCardClass =
    baseLayersExpanded || apfloraLayersExpanded || overlaysExpanded ?
      styles.cardTitle
    : styles.cardTitleApfloraOpen

  // hack to get control to show on first load
  // depends on state being changed, so needs to be true above
  // see: https://github.com/LiveBy/react-leaflet-control/issues/27#issuecomment-430564722
  useEffect(() => {
    setBaseLayersExpanded(false)
  }, [])

  // prevent click propagation on to map
  // https://stackoverflow.com/a/57013052/712005
  const ref = useRef()
  useEffect(() => {
    window.L.DomEvent.disableClickPropagation(ref.current)
    window.L.DomEvent.disableScrollPropagation(ref.current)
  }, [])

  return (
    <div
      className={styles.container}
      ref={ref}
    >
      <div className={styles.card}>
        <div
          className={styles.cardHeader}
          onClick={onToggleApfloraLayersExpanded}
        >
          <div className={apfloraCardClass}>apflora</div>
          <div>
            {apfloraLayersExpanded ?
              <MdExpandLess className={styles.expandIcon} />
            : <MdExpandMore className={styles.expandIcon} />}
          </div>
        </div>
        {apfloraLayersExpanded && (
          <ApfloraLayers
            /**
             * overlaysString enforces rererender
             * even when only the sorting changes
             */
            apfloraLayersString={apfloraLayers.map((o) => o.value).join()}
          />
        )}
      </div>
      <div className={styles.card}>
        <div
          className={styles.cardHeader}
          onClick={onToggleOverlaysExpanded}
        >
          <div className={styles.cardTitle}>überlagernd</div>
          <div>
            {overlaysExpanded ?
              <MdExpandLess className={styles.expandIcon} />
            : <MdExpandMore className={styles.expandIcon} />}
          </div>
        </div>
        {overlaysExpanded && (
          <Overlays
            /**
             * overlaysString enforces rererender
             * even when only the sorting changes
             */
            overlaysString={overlays.map((o) => o.value).join()}
          />
        )}
      </div>
      <div className={styles.card}>
        <div
          className={styles.cardHeader}
          onClick={onToggleBaseLayersExpanded}
        >
          <div className={styles.cardTitle}>Hintergrund</div>
          <div>
            {baseLayersExpanded ?
              <MdExpandLess className={styles.expandIcon} />
            : <MdExpandMore className={styles.expandIcon} />}
          </div>
        </div>
        {baseLayersExpanded && <BaseLayers />}
      </div>
    </div>
  )
}
