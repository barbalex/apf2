import React, { useContext, useState, useCallback, useEffect } from 'react'
import Control from 'react-leaflet-control'
import styled from 'styled-components'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { observer } from 'mobx-react-lite'

import Overlays from './Overlays'
import ApfloraLayers from './ApfloraLayers'
import BaseLayers from './BaseLayers'
import storeContext from '../../../../storeContext'
import { getSnapshot } from 'mobx-state-tree'

const CardContainer = styled.div`
  background-color: white;
  background-clip: padding-box;
  border-radius: 5px;
  border: 2px solid rgba(0, 0, 0, 0.2);
`
const Card = styled.div`
  padding-top: 3px;
  color: rgb(48, 48, 48);
  &:not(:first-of-type) {
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }
`
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 7px;
  padding-right: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-weight: bold;
  user-select: none;
`
const CardTitle = styled.div`
  padding-right: 5px;
`
const CardTitleApfloraOpen = styled(CardTitle)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 70px;
`
const StyledExpandLessIcon = styled(ExpandLessIcon)`
  height: 18px !important;
`
const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  height: 18px !important;
`

const LayersControl = ({ treeName }) => {
  const store = useContext(storeContext)
  const { apfloraLayers, overlays } = store
  const activeNodes = store[`${treeName}ActiveNodes`]

  const [baseLayersExpanded, setBaseLayersExpanded] = useState(true)
  const [overlaysExpanded, setOverlaysExpanded] = useState(false)
  const [apfloraLayersExpanded, setApfloraLayersExpanded] = useState(false)

  const onToggleBaseLayersExpanded = useCallback(
    event => {
      event.stopPropagation()
      setBaseLayersExpanded(!baseLayersExpanded)
      if (overlaysExpanded) {
        setOverlaysExpanded(!overlaysExpanded)
      }
      if (apfloraLayersExpanded) {
        setApfloraLayersExpanded(!apfloraLayersExpanded)
      }
    },
    [baseLayersExpanded, overlaysExpanded, apfloraLayersExpanded],
  )
  const onToggleOverlaysExpanded = useCallback(() => {
    setOverlaysExpanded(!overlaysExpanded)
    if (baseLayersExpanded) {
      setBaseLayersExpanded(!baseLayersExpanded)
    }
    if (apfloraLayersExpanded) {
      setApfloraLayersExpanded(!apfloraLayersExpanded)
    }
  }, [overlaysExpanded, baseLayersExpanded, apfloraLayersExpanded])
  const onToggleApfloraLayersExpanded = useCallback(() => {
    setApfloraLayersExpanded(!apfloraLayersExpanded)
    if (overlaysExpanded) {
      setOverlaysExpanded(!overlaysExpanded)
    }
    if (baseLayersExpanded) {
      setBaseLayersExpanded(!baseLayersExpanded)
    }
  }, [overlaysExpanded, baseLayersExpanded, apfloraLayersExpanded])

  const getApfloraLayersTitle = () => {
    if (!activeNodes.ap) return 'apflora'
    const ap = activeNodes.ap
    if (!ap || !ap.label) return 'apflora'
    return ap.label
  }
  const ApfloraCard =
    baseLayersExpanded || apfloraLayersExpanded || overlaysExpanded
      ? CardTitle
      : CardTitleApfloraOpen

  // hack to get control to show on first load
  // depends on state being changed, so needs to be true above
  // see: https://github.com/LiveBy/react-leaflet-control/issues/27#issuecomment-430564722
  useEffect(() => {
    setBaseLayersExpanded(false)
  }, [])

  console.log('LayersControl', {
    overlays: getSnapshot(overlays),
    overlaysExpanded,
  })

  return (
    <Control position="topright">
      <CardContainer>
        <Card>
          <CardHeader onClick={onToggleApfloraLayersExpanded}>
            <ApfloraCard>{getApfloraLayersTitle()}</ApfloraCard>
            <div>
              {apfloraLayersExpanded ? (
                <StyledExpandLessIcon />
              ) : (
                <StyledExpandMoreIcon />
              )}
            </div>
          </CardHeader>
          {apfloraLayersExpanded && (
            <ApfloraLayers
              treeName={treeName}
              /**
               * overlaysString enforces rererender
               * even when only the sorting changes
               */
              apfloraLayersString={apfloraLayers.map(o => o.value).join()}
            />
          )}
        </Card>
        <Card>
          <CardHeader onClick={onToggleOverlaysExpanded}>
            <CardTitle>überlagernd</CardTitle>
            <div>
              {overlaysExpanded ? (
                <StyledExpandLessIcon />
              ) : (
                <StyledExpandMoreIcon />
              )}
            </div>
          </CardHeader>
          {overlaysExpanded && (
            <Overlays
              /**
               * overlaysString enforces rererender
               * even when only the sorting changes
               */
              overlaysString={overlays.map(o => o.value).join()}
            />
          )}
        </Card>
        <Card>
          <CardHeader onClick={onToggleBaseLayersExpanded}>
            <CardTitle>Hintergrund</CardTitle>
            <div>
              {baseLayersExpanded ? (
                <StyledExpandLessIcon />
              ) : (
                <StyledExpandMoreIcon />
              )}
            </div>
          </CardHeader>
          {baseLayersExpanded && <BaseLayers />}
        </Card>
      </CardContainer>
    </Control>
  )
}

export default observer(LayersControl)
