/**
 * TODO:
 * let each item call it's data itself
 */
import React, { useContext, useCallback, useMemo } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import {
  MdPauseCircleOutline,
  MdPlayCircleOutline,
  MdLocalFlorist,
  MdFilterCenterFocus,
  MdRemove,
} from 'react-icons/md'
import flatten from 'lodash/flatten'
import { getSnapshot } from 'mobx-state-tree'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { useMap } from 'react-leaflet'

import Checkbox from '../../shared/Checkbox'
import Error from '../../../../../shared/Error'
import getBounds from '../../../../../../modules/getBounds'
import storeContext from '../../../../../../storeContext'
import query from './query'
import PopIcon from './PopIcon'
import TpopIcon from './TpopIcon'

const PauseCircleOutlineIcon = styled(MdPauseCircleOutline)`
  font-size: 1.5rem;
`
const PlayCircleOutlineIcon = styled(MdPlayCircleOutline)`
  font-size: 1.5rem;
`
const LocalFloristIcon = styled(MdLocalFlorist)`
  font-size: 1.5rem;
`
const FilterCenterFocusIcon = styled(MdFilterCenterFocus)`
  font-size: 1.5rem;
`
const RemoveIcon = styled(MdRemove)`
  font-size: 1.5rem;
`
const StyledIconButton = styled(Button)`
  max-width: 18px;
  min-height: 20px !important;
  min-width: 20px !important;
  padding: 0 !important;
  margin-top: -3px !important;
`
const StyledPauseCircleOutlineIcon = styled(PauseCircleOutlineIcon)`
  cursor: ${(props) =>
    props['data-assigningispossible'] ? 'pointer' : 'not-allowed'};
`
const StyledPlayCircleOutlineIcon = styled(PlayCircleOutlineIcon)`
  color: ${(props) =>
    props['data-assigningispossible'] ? 'black' : 'rgba(0,0,0,0.2) !important'};
  cursor: ${(props) =>
    props['data-assigningispossible'] ? 'pointer' : 'not-allowed'};
`
const ZoomToIcon = styled(FilterCenterFocusIcon)`
  height: 20px !important;
`
const LayerDiv = styled.div`
  display: flex;
  min-height: 24px;
  justify-content: space-between;
  padding-top: 4px;
  &:not(:last-of-type) {
    border-bottom: 1px solid #ececec;
  }
  /*
   * z-index is needed because leaflet
   * sets high one for controls
   */
  z-index: 2000;
  /*
   * font-size is lost while moving a layer
   * because it is inherited from higher up
   */
  font-size: 12px;
`
const IconsDiv = styled.div`
  display: flex;
`
const ZuordnenDiv = styled.div``
const ZoomToDiv = styled.div`
  padding-left: 3px;
  min-width: 18px;
`
const MapIcon = styled(LocalFloristIcon)`
  margin-right: -0.1em;
  height: 20px !important;
  paint-order: stroke;
  stroke-width: 1px;
  stroke: black;
`
const BeobNichtBeurteiltMapIcon = styled(MapIcon)`
  color: #9a009a !important;
`
const BeobNichtZuzuordnenMapIcon = styled(MapIcon)`
  color: #ffe4ff !important;
`
const BeobZugeordnetMapIcon = styled(MapIcon)`
  color: #ff00ff !important;
`
const BeobZugeordnetAssignPolylinesIcon = styled(RemoveIcon)`
  margin-right: -0.1em;
  height: 20px !important;
  color: #ff00ff !important;
`
const MapIconDiv = styled.div``

const MySortableItem = ({ treeName, apfloraLayer }) => {
  const map = useMap()
  const store = useContext(storeContext)
  const {
    activeApfloraLayers: activeApfloraLayersRaw,
    setActiveApfloraLayers,
    assigningBeob,
    setAssigningBeob,
    setBounds,
  } = store
  const tree = store[treeName]
  const { apIdInActiveNodeArray, activeNodeArray, beobGqlFilter } = tree
  const activeApfloraLayers = getSnapshot(activeApfloraLayersRaw)
  const layer = apfloraLayer.value
  const pop = layer === 'pop' && activeApfloraLayers.includes('pop')
  const tpop = layer === 'tpop' && activeApfloraLayers.includes('tpop')
  const showBeobNichtBeurteilt =
    layer === 'beobNichtBeurteilt' &&
    activeApfloraLayers.includes('beobNichtBeurteilt')
  const showBeobNichtZuzuordnen =
    layer === 'beobNichtZuzuordnen' &&
    activeApfloraLayers.includes('beobNichtZuzuordnen')
  const showBeobZugeordnet =
    layer === 'beobZugeordnet' && activeApfloraLayers.includes('beobZugeordnet')
  const showBeobZugeordnetAssignPolylines =
    layer === 'beobZugeordnetAssignPolylines' &&
    activeApfloraLayers.includes('beobZugeordnetAssignPolylines')

  const variables = {
    ap: apIdInActiveNodeArray ? [apIdInActiveNodeArray] : [],
    pop,
    tpop,
    showBeobNichtBeurteilt,
    beobNichtBeurteiltFilter: beobGqlFilter('nichtBeurteilt').filtered,
    showBeobNichtZuzuordnen,
    beobNichtZuzuordnenFilter: beobGqlFilter('nichtZuordnen').filtered,
    showBeobZugeordnet,
    beobZugeordnetFilter: beobGqlFilter('zugeordnet').filtered,
    showBeobZugeordnetAssignPolylines,
  }

  const { data, error } = useQuery(query, {
    variables,
  })

  const assigningispossible =
    activeApfloraLayers.includes('tpop') &&
    ((activeApfloraLayers.includes('beobNichtBeurteilt') &&
      apfloraLayer.value === 'beobNichtBeurteilt') ||
      (activeApfloraLayers.includes('beobZugeordnet') &&
        apfloraLayer.value === 'beobZugeordnet'))
  const zuordnenTitle = useMemo(() => {
    if (assigningBeob) return 'Zuordnung beenden'
    if (assigningispossible) return 'Teil-Populationen zuordnen'
    return 'Teil-Populationen zuordnen (aktivierbar, wenn auch Teil-Populationen eingeblendet werden)'
  }, [assigningBeob, assigningispossible])
  // for each layer there must exist a path in data!
  let layerData = useMemo(
    () => data?.[apfloraLayer.value]?.nodes ?? [],
    [apfloraLayer, data],
  )
  if (apfloraLayer.value === 'tpop') {
    // but tpop is special...
    const tpops = data?.tpopByPop?.nodes ?? []
    layerData = flatten(tpops.map((n) => n?.tpopsByPopId?.nodes ?? []))
  }
  const layerDataHighlighted = layerData.filter(
    (o) => o.id === activeNodeArray[activeNodeArray.length - 1],
  )
  const onChangeCheckbox = useCallback(() => {
    if (activeApfloraLayers.includes(apfloraLayer.value)) {
      return setActiveApfloraLayers(
        activeApfloraLayers.filter((l) => l !== apfloraLayer.value),
      )
    }
    return setActiveApfloraLayers([...activeApfloraLayers, apfloraLayer.value])
  }, [activeApfloraLayers, apfloraLayer.value, setActiveApfloraLayers])
  const onClickZuordnen = useCallback(() => {
    if (activeApfloraLayers.includes('tpop')) {
      setAssigningBeob(!assigningBeob)
    }
  }, [activeApfloraLayers, setAssigningBeob, assigningBeob])
  const onClickZoomToAll = useCallback(() => {
    // console.log('zoomToAll')
    // only zoom if there is data to zoom on
    if (layerData.length === 0) return
    if (activeApfloraLayers.includes(apfloraLayer.value)) {
      const newBounds = getBounds(layerData)
      map.fitBounds(newBounds)
      setBounds(newBounds)
    }
  }, [layerData, activeApfloraLayers, apfloraLayer.value, map, setBounds])
  const onClickZoomToActive = useCallback(() => {
    // console.log('zoomToActive')
    if (activeApfloraLayers.includes(apfloraLayer.value)) {
      const highlightedObjects = layerData.filter(
        (o) => o.id === activeNodeArray[activeNodeArray.length - 1],
      )
      const newBounds = getBounds(highlightedObjects)
      if (newBounds) {
        map.fitBounds(newBounds)
        setBounds(newBounds)
      }
    }
  }, [
    layerData,
    activeApfloraLayers,
    apfloraLayer.value,
    map,
    setBounds,
    activeNodeArray,
  ])
  const zoomToAllIconStyle = useMemo(
    () => ({
      color:
        activeApfloraLayers.includes(apfloraLayer.value) && layerData.length > 0
          ? 'black'
          : '#e2e2e2',
      fontWeight:
        activeApfloraLayers.includes(apfloraLayer.value) && layerData.length > 0
          ? 'bold'
          : 'normal',
      cursor:
        activeApfloraLayers.includes(apfloraLayer.value) && layerData.length > 0
          ? 'pointer'
          : 'not-allowed',
    }),
    [activeApfloraLayers, apfloraLayer, layerData],
  )
  const zoomToActiveIconStyle = useMemo(
    () => ({
      color:
        activeApfloraLayers.includes(apfloraLayer.value) &&
        layerDataHighlighted.length > 0
          ? '#fbec04'
          : '#e2e2e2',
      fontWeight:
        activeApfloraLayers.includes(apfloraLayer.value) &&
        layerDataHighlighted.length > 0
          ? 'bold'
          : 'normal',
      cursor:
        activeApfloraLayers.includes(apfloraLayer.value) &&
        layerDataHighlighted.length > 0
          ? 'pointer'
          : 'not-allowed',
    }),
    [activeApfloraLayers, apfloraLayer, layerDataHighlighted],
  )

  if (error) return <Error error={error} />

  return (
    <LayerDiv>
      <Checkbox
        value={apfloraLayer.value}
        label={apfloraLayer.label}
        checked={activeApfloraLayers.includes(apfloraLayer.value)}
        onChange={onChangeCheckbox}
      />
      <IconsDiv>
        {['beobNichtBeurteilt', 'beobZugeordnet'].includes(
          apfloraLayer.value,
        ) && (
          <ZuordnenDiv>
            <StyledIconButton
              title={zuordnenTitle}
              onClick={onClickZuordnen}
              color="inherit"
            >
              {assigningBeob ? (
                <StyledPauseCircleOutlineIcon
                  data-assigningispossible={assigningispossible}
                />
              ) : (
                <StyledPlayCircleOutlineIcon
                  data-assigningispossible={assigningispossible}
                />
              )}
            </StyledIconButton>
          </ZuordnenDiv>
        )}
        {apfloraLayer.value === 'pop' &&
          activeApfloraLayers.includes('pop') && (
            <PopIcon treeName={treeName} />
          )}
        {apfloraLayer.value === 'tpop' &&
          activeApfloraLayers.includes('tpop') && (
            <TpopIcon treeName={treeName} />
          )}
        {apfloraLayer.value === 'beobNichtBeurteilt' &&
          activeApfloraLayers.includes('beobNichtBeurteilt') && (
            <MapIconDiv>
              <BeobNichtBeurteiltMapIcon id="BeobNichtBeurteiltMapIcon" />
            </MapIconDiv>
          )}
        {apfloraLayer.value === 'beobNichtZuzuordnen' &&
          activeApfloraLayers.includes('beobNichtZuzuordnen') && (
            <MapIconDiv>
              <BeobNichtZuzuordnenMapIcon id="BeobNichtZuzuordnenMapIcon" />
            </MapIconDiv>
          )}
        {apfloraLayer.value === 'beobZugeordnet' &&
          activeApfloraLayers.includes('beobZugeordnet') && (
            <MapIconDiv>
              <BeobZugeordnetMapIcon id="BeobZugeordnetMapIcon" />
            </MapIconDiv>
          )}
        {apfloraLayer.value === 'beobZugeordnetAssignPolylines' &&
          activeApfloraLayers.includes('beobZugeordnetAssignPolylines') && (
            <MapIconDiv>
              <BeobZugeordnetAssignPolylinesIcon
                id="BeobZugeordnetAssignPolylinesMapIcon"
                className="material-icons"
              >
                remove
              </BeobZugeordnetAssignPolylinesIcon>
            </MapIconDiv>
          )}
        <ZoomToDiv>
          {apfloraLayer.value !== 'mapFilter' && (
            <StyledIconButton
              title={`auf alle ${apfloraLayer.label} zoomen`}
              onClick={onClickZoomToAll}
              color="inherit"
            >
              <ZoomToIcon style={zoomToAllIconStyle} />
            </StyledIconButton>
          )}
        </ZoomToDiv>
        <ZoomToDiv>
          {apfloraLayer.value !== 'mapFilter' && (
            <StyledIconButton
              title={`auf aktive ${apfloraLayer.label} zoomen`}
              onClick={onClickZoomToActive}
              color="inherit"
            >
              <ZoomToIcon style={zoomToActiveIconStyle} />
            </StyledIconButton>
          )}
        </ZoomToDiv>
      </IconsDiv>
    </LayerDiv>
  )
}

export default observer(MySortableItem)
