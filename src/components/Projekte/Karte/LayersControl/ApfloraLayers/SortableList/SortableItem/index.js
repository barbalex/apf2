// @flow
/**
 * TODO:
 * let each item call it's data itself
 */
import React, { useContext, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus'
import RemoveIcon from '@material-ui/icons/Remove'
import { SortableElement, SortableHandle } from 'react-sortable-hoc'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { getSnapshot } from 'mobx-state-tree'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'

import Checkbox from '../../../shared/Checkbox'
import getBounds from '../../../../../../../modules/getBounds'
import mobxStoreContext from '../../../../../../../mobxStoreContext'
import query from './data'

const StyledIconButton = styled(Button)`
  max-width: 18px;
  min-height: 20px !important;
  min-width: 20px !important;
  padding: 0 !important;
  margin-top: -3px !important;
`
const StyledPauseCircleOutlineIcon = styled(PauseCircleOutlineIcon)`
  cursor: ${props =>
    props['data-assigningispossible'] ? 'pointer' : 'not-allowed'};
`
const StyledPlayCircleOutlineIcon = styled(PlayCircleOutlineIcon)`
  color: ${props =>
    props['data-assigningispossible'] ? 'black' : 'rgba(0,0,0,0.2) !important'};
  cursor: ${props =>
    props['data-assigningispossible'] ? 'pointer' : 'not-allowed'};
`
const StyledDragHandleIcon = styled(DragHandleIcon)`
  height: 20px !important;
  color: #7b7b7b !important;
  cursor: grab;
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
const PopMapIcon = styled(MapIcon)`
  color: #947500 !important;
`
const TpopMapIcon = styled(MapIcon)`
  color: #016f19 !important;
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

const DragHandle = SortableHandle(() => (
  <StyledIconButton title="ziehen, um Layer höher/tiefer zu stapeln">
    <StyledDragHandleIcon />
  </StyledIconButton>
))

const MySortableItem = ({ treeName, apfloraLayer, index }) => {
  const mobxStore = useContext(mobxStoreContext)
  const {
    activeApfloraLayers: activeApfloraLayersRaw,
    setActiveApfloraLayers,
    setBounds,
    assigningBeob,
    setAssigningBeob,
  } = mobxStore
  const { idsFiltered } = mobxStore[treeName].map
  const activeApfloraLayers = getSnapshot(activeApfloraLayersRaw)
  const mapIdsFiltered = idsFiltered
  const activeNodes = mobxStore[`${treeName}ActiveNodes`]
  const layer = apfloraLayer.value
  const pop = layer === 'pop' && activeApfloraLayers.includes('pop')
  const tpop = layer === 'tpop' && activeApfloraLayers.includes('tpop')
  const beobNichtBeurteilt =
    layer === 'beobNichtBeurteilt' &&
    activeApfloraLayers.includes('beobNichtBeurteilt')
  const beobNichtZuzuordnen =
    layer === 'beobNichtZuzuordnen' &&
    activeApfloraLayers.includes('beobNichtZuzuordnen')
  const beobZugeordnet =
    layer === 'beobZugeordnet' && activeApfloraLayers.includes('beobZugeordnet')
  const beobZugeordnetAssignPolylines =
    layer === 'beobZugeordnetAssignPolylines' &&
    activeApfloraLayers.includes('beobZugeordnetAssignPolylines')

  const variables = {
    ap: activeNodes.ap ? [activeNodes.ap] : [],
    pop,
    tpop,
    beobNichtBeurteilt,
    beobNichtZuzuordnen,
    beobZugeordnet,
    beobZugeordnetAssignPolylines,
  }

  const { data, error } = useQuery(query, {
    suspend: false,
    variables,
  })

  const SortableItem = SortableElement(() => {
    const assigningispossible =
      activeApfloraLayers.includes('tpop') &&
      ((activeApfloraLayers.includes('beobNichtBeurteilt') &&
        apfloraLayer.value === 'beobNichtBeurteilt') ||
        (activeApfloraLayers.includes('beobZugeordnet') &&
          apfloraLayer.value === 'beobZugeordnet'))
    const zuordnenTitle = useMemo(
      () => {
        if (assigningBeob) return 'Zuordnung beenden'
        if (assigningispossible) return 'Teil-Populationen zuordnen'
        return 'Teil-Populationen zuordnen (aktivierbar, wenn auch Teil-Populationen eingeblendet werden)'
      },
      [assigningBeob, assigningispossible],
    )
    // for each layer there must exist a path in data!
    let layerData = get(data, `${apfloraLayer.value}.nodes`, [])
    if (apfloraLayer.value === 'tpop') {
      // but tpop is special...
      const pops = get(data, 'tpopByPop.nodes', [])
      layerData = flatten(pops.map(n => get(n, 'tpopsByPopId.nodes', [])))
    }
    const layerDataHighlighted = layerData.filter(o =>
      mapIdsFiltered.includes(o.id),
    )
    const onChangeCheckbox = useCallback(
      () => {
        if (activeApfloraLayers.includes(apfloraLayer.value)) {
          return setActiveApfloraLayers(
            activeApfloraLayers.filter(l => l !== apfloraLayer.value),
          )
        }
        return setActiveApfloraLayers([
          ...activeApfloraLayers,
          apfloraLayer.value,
        ])
      },
      [activeApfloraLayers, apfloraLayer],
    )
    const onClickZuordnen = useCallback(
      () => {
        if (activeApfloraLayers.includes('tpop')) {
          setAssigningBeob(!assigningBeob)
        }
      },
      [assigningBeob, activeApfloraLayers],
    )
    const onClickZoomToAll = useCallback(
      () => {
        // only zoom if there is data to zoom on
        if (layerData.length === 0) return
        if (activeApfloraLayers.includes(apfloraLayer.value)) {
          setBounds(getBounds(layerData))
        }
      },
      [layerData, activeApfloraLayers, apfloraLayer],
    )
    const onClickZoomToActive = useCallback(
      () => {
        // only zoom if a tpop is highlighted
        if (layerDataHighlighted.length === 0) return
        if (activeApfloraLayers.includes(apfloraLayer.value)) {
          const newBounds = getBounds(layerDataHighlighted)
          setBounds(newBounds)
        }
      },
      [layerDataHighlighted, activeApfloraLayers, apfloraLayer],
    )
    const zoomToAllIconStyle = useMemo(
      () => ({
        color:
          activeApfloraLayers.includes(apfloraLayer.value) &&
          layerData.length > 0
            ? 'black'
            : '#e2e2e2',
        fontWeight:
          activeApfloraLayers.includes(apfloraLayer.value) &&
          layerData.length > 0
            ? 'bold'
            : 'normal',
        cursor:
          activeApfloraLayers.includes(apfloraLayer.value) &&
          layerData.length > 0
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

    if (error) return `Fehler: ${error.message}`
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
              <StyledIconButton title={zuordnenTitle} onClick={onClickZuordnen}>
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
          {apfloraLayer.value === 'pop' && activeApfloraLayers.includes('pop') && (
            <MapIconDiv>
              <PopMapIcon id="PopMapIcon" />
            </MapIconDiv>
          )}
          {apfloraLayer.value === 'tpop' &&
            activeApfloraLayers.includes('tpop') && (
              <MapIconDiv>
                <TpopMapIcon id="TpopMapIcon" />
              </MapIconDiv>
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
              >
                <ZoomToIcon style={zoomToActiveIconStyle} />
              </StyledIconButton>
            )}
          </ZoomToDiv>
          <div>
            {!['beobZugeordnetAssignPolylines', 'mapFilter'].includes(
              apfloraLayer.value,
            ) && <DragHandle />}
          </div>
        </IconsDiv>
      </LayerDiv>
    )
  })
  return <SortableItem index={index} />
}

export default observer(MySortableItem)
