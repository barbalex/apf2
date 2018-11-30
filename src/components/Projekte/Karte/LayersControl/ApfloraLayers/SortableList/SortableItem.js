import React, { useContext, useCallback } from 'react'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus'
import RemoveIcon from '@material-ui/icons/Remove'
import PhotoFilterIcon from '@material-ui/icons/PhotoFilter'
import { SortableElement, SortableHandle } from 'react-sortable-hoc'
import 'leaflet'
import 'leaflet-draw'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import { withApollo } from 'react-apollo'
import { getSnapshot } from 'mobx-state-tree'

import Checkbox from '../../shared/Checkbox'
import withData from '../withData'
import getBounds from '../../../../../../modules/getBounds'
import mobxStoreContext from '../../../../../../mobxStoreContext'

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
const FilterIcon = styled(PhotoFilterIcon)`
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
const FilterDiv = styled.div`
  padding-left: 3px;
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
const SortableItem = SortableElement(
  ({ treeName, apfloraLayer, data, client }) => {
    const mobxStore = useContext(mobxStoreContext)
    const {
      activeApfloraLayers,
      setActiveApfloraLayers,
      setBounds,
      assigningBeob,
      setAssigningBeob,
    } = mobxStore
    const { idsFiltered: mapIdsFiltered } = mobxStore[treeName].map

    const assigningispossible =
      activeApfloraLayers.includes('tpop') &&
      ((activeApfloraLayers.includes('beobNichtBeurteilt') &&
        apfloraLayer.value === 'beobNichtBeurteilt') ||
        (activeApfloraLayers.includes('beobZugeordnet') &&
          apfloraLayer.value === 'beobZugeordnet'))
    const getZuordnenIconTitle = () => {
      if (assigningBeob) return 'Zuordnung beenden'
      if (assigningispossible) return 'Teil-Populationen zuordnen'
      return 'Teil-Populationen zuordnen (aktivierbar, wenn auch Teil-Populationen eingeblendet werden)'
    }
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

    return (
      <LayerDiv>
        <Checkbox
          value={apfloraLayer.value}
          label={apfloraLayer.label}
          checked={activeApfloraLayers.includes(apfloraLayer.value)}
          onChange={() => {
            if (activeApfloraLayers.includes(apfloraLayer.value)) {
              return setActiveApfloraLayers(
                activeApfloraLayers.filter(l => l !== apfloraLayer.value),
              )
            }
            return setActiveApfloraLayers([
              ...activeApfloraLayers,
              apfloraLayer.value,
            ])
          }}
        />
        <IconsDiv>
          {['beobNichtBeurteilt', 'beobZugeordnet'].includes(
            apfloraLayer.value,
          ) && (
            <ZuordnenDiv>
              <StyledIconButton
                title={getZuordnenIconTitle()}
                onClick={() => {
                  if (activeApfloraLayers.includes('tpop')) {
                    setAssigningBeob(!assigningBeob)
                  }
                }}
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
          {false && (
            <FilterDiv>
              {[
                'pop',
                'tpop',
                'beobNichtBeurteilt',
                'beobNichtZuzuordnen',
                'beobZugeordnet',
              ].includes(apfloraLayer.value) && (
                <StyledIconButton
                  title="mit Umriss(en) filtern"
                  onClick={() => {
                    if (activeApfloraLayers.includes('mapFilter')) {
                      return setActiveApfloraLayers(
                        activeApfloraLayers.filter(l => l !== 'mapFilter'),
                      )
                    }
                    setActiveApfloraLayers([
                      ...activeApfloraLayers,
                      'mapFilter',
                    ])
                    // this does not work, see: https://github.com/Leaflet/Leaflet.draw/issues/708
                    //window.L.Draw.Rectangle.initialize()
                  }}
                >
                  <FilterIcon
                    style={{
                      color: activeApfloraLayers.includes(apfloraLayer.value)
                        ? 'black'
                        : '#e2e2e2',
                      cursor: activeApfloraLayers.includes(apfloraLayer.value)
                        ? 'pointer'
                        : 'not-allowed',
                    }}
                  />
                </StyledIconButton>
              )}
            </FilterDiv>
          )}
          <ZoomToDiv>
            {apfloraLayer.value !== 'mapFilter' && (
              <StyledIconButton
                title={`auf alle ${apfloraLayer.label} zoomen`}
                onClick={() => {
                  // only zoom if there is data to zoom on
                  if (layerData.length === 0) return
                  if (activeApfloraLayers.includes(apfloraLayer.value)) {
                    setBounds(getBounds(layerData))
                  }
                }}
              >
                <ZoomToIcon
                  style={{
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
                  }}
                />
              </StyledIconButton>
            )}
          </ZoomToDiv>
          <ZoomToDiv>
            {apfloraLayer.value !== 'mapFilter' && (
              <StyledIconButton
                title={`auf aktive ${apfloraLayer.label} zoomen`}
                onClick={() => {
                  // only zoom if a tpop is highlighted
                  if (layerDataHighlighted.length === 0) return
                  if (activeApfloraLayers.includes(apfloraLayer.value)) {
                    const newBounds = getBounds(layerDataHighlighted)
                    setBounds(newBounds)
                  }
                }}
              >
                <ZoomToIcon
                  style={{
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
                  }}
                />
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
  },
)

export default SortableItem
