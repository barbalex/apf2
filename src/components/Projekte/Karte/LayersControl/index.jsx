import { useContext, useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { observer } from 'mobx-react-lite'

import { Overlays } from './Overlays.jsx'
import { ApfloraLayers } from './ApfloraLayers/index.jsx'
import { BaseLayers } from './BaseLayers/index.jsx'
import { MobxContext } from '../../../../mobxContext.js'

const Container = styled.div`
  background-color: white;
  background-clip: padding-box;
  border-radius: 5px;
  border: 2px solid rgba(0, 0, 0, 0.2);
`
const Card = styled.div`
  padding-top: 3px;
  color: rgb(48, 48, 48);
`
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 6px;
  padding-right: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-weight: bold;
  user-select: none;
`
const CardTitle = styled.div`
  padding-right: 5px;
`
const CardTitleApfloraOpen = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 70px;
  padding-right: 5px;
`
const ExpandLessIcon = styled(MdExpandLess)`
  font-size: 1.5rem;
  height: 18px !important;
`
const ExpandMoreIcon = styled(MdExpandMore)`
  font-size: 1.5rem;
  height: 18px !important;
`

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

  const ApfloraCard =
    baseLayersExpanded || apfloraLayersExpanded || overlaysExpanded ?
      CardTitle
    : CardTitleApfloraOpen

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
    <Container ref={ref}>
      <Card>
        <CardHeader onClick={onToggleApfloraLayersExpanded}>
          <ApfloraCard>apflora</ApfloraCard>
          <div>
            {apfloraLayersExpanded ?
              <ExpandLessIcon />
            : <ExpandMoreIcon />}
          </div>
        </CardHeader>
        {apfloraLayersExpanded && (
          <ApfloraLayers
            /**
             * overlaysString enforces rererender
             * even when only the sorting changes
             */
            apfloraLayersString={apfloraLayers.map((o) => o.value).join()}
          />
        )}
      </Card>
      <Card>
        <CardHeader onClick={onToggleOverlaysExpanded}>
          <CardTitle>überlagernd</CardTitle>
          <div>
            {overlaysExpanded ?
              <ExpandLessIcon />
            : <ExpandMoreIcon />}
          </div>
        </CardHeader>
        {overlaysExpanded && (
          <Overlays
            /**
             * overlaysString enforces rererender
             * even when only the sorting changes
             */
            overlaysString={overlays.map((o) => o.value).join()}
          />
        )}
      </Card>
      <Card>
        <CardHeader onClick={onToggleBaseLayersExpanded}>
          <CardTitle>Hintergrund</CardTitle>
          <div>
            {baseLayersExpanded ?
              <ExpandLessIcon />
            : <ExpandMoreIcon />}
          </div>
        </CardHeader>
        {baseLayersExpanded && <BaseLayers />}
      </Card>
    </Container>
  )
})
