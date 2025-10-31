import { useContext, useState, useEffect, useRef } from 'react'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { observer } from 'mobx-react-lite'

import { Overlays } from './Overlays.jsx'
import { ApfloraLayers } from './ApfloraLayers/index.jsx'
import { BaseLayers } from './BaseLayers/index.jsx'
import { MobxContext } from '../../../../mobxContext.js'

import {
  container,
  card,
  cardHeader,
  cardTitle,
  cardTitleApfloraOpen,
  expandIcon,
} from './index.module.css'

export const LayersControl = observer(() => {
  const store = useContext(MobxContext)
  const { apfloraLayers, overlays } = store

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
      cardTitle
    : cardTitleApfloraOpen

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
      className={container}
      ref={ref}
    >
      <div className={card}>
        <div
          className={cardHeader}
          onClick={onToggleApfloraLayersExpanded}
        >
          <div className={apfloraCardClass}>apflora</div>
          <div>
            {apfloraLayersExpanded ?
              <MdExpandLess className={expandIcon} />
            : <MdExpandMore className={expandIcon} />}
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
      <div className={card}>
        <div
          className={cardHeader}
          onClick={onToggleOverlaysExpanded}
        >
          <div className={cardTitle}>überlagernd</div>
          <div>
            {overlaysExpanded ?
              <MdExpandLess className={expandIcon} />
            : <MdExpandMore className={expandIcon} />}
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
      <div className={card}>
        <div
          className={cardHeader}
          onClick={onToggleBaseLayersExpanded}
        >
          <div className={cardTitle}>Hintergrund</div>
          <div>
            {baseLayersExpanded ?
              <MdExpandLess className={expandIcon} />
            : <MdExpandMore className={expandIcon} />}
          </div>
        </div>
        {baseLayersExpanded && <BaseLayers />}
      </div>
    </div>
  )
})
