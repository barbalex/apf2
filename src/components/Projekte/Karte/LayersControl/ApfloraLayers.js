import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Button from 'material-ui-next/Button'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import LocalFloristIcon from '@material-ui/icons/LocalFlorist'
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus'
import RemoveIcon from '@material-ui/icons/Remove'
import PhotoFilterIcon from '@material-ui/icons/PhotoFilter'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc'
import 'leaflet'
import 'leaflet-draw'

import Checkbox from './shared/Checkbox'
import bufferBoundsTo50m from '../../../../modules/bufferBoundsTo50m'

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
const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 4px;
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
  -webkit-text-stroke: 1px black;
  -moz-text-stroke: 1px black;
`
const PopMapIcon = MapIcon.extend`
  color: #947500 !important;
`
const TpopMapIcon = MapIcon.extend`
  color: #016f19 !important;
`
const BeobNichtBeurteiltMapIcon = MapIcon.extend`
  color: #9a009a !important;
`
const BeobNichtZuzuordnenMapIcon = MapIcon.extend`
  color: #ffe4ff !important;
`
const BeobZugeordnetMapIcon = MapIcon.extend`
  color: #ff00ff !important;
`
const BeobZugeordnetAssignPolylinesIcon = styled(RemoveIcon)`
  margin-right: -0.1em;
  height: 20px !important;
  color: #ff00ff !important;
`
const MapIconDiv = styled.div``
/**
 * don't know why but passing store
 * with mobx inject does not work here
 * so passed in from parent
 */

const DragHandle = SortableHandle(() => (
  <StyledIconButton title="ziehen, um Layer höher/tiefer zu stapeln">
    <StyledDragHandleIcon />
  </StyledIconButton>
))
const SortableItem = SortableElement(
  ({ apfloraLayer, store, activeApfloraLayers }) => {
    const assigningispossible =
      store.map.activeApfloraLayers.includes('Tpop') &&
      ((store.map.activeApfloraLayers.includes('BeobNichtBeurteilt') &&
        apfloraLayer.value === 'BeobNichtBeurteilt') ||
        (store.map.activeApfloraLayers.includes('BeobZugeordnet') &&
          apfloraLayer.value === 'BeobZugeordnet'))
    console.log('assigningispossible:', assigningispossible)
    const getZuordnenIconTitle = () => {
      if (store.map.beob.assigning) return 'Zuordnung beenden'
      if (assigningispossible) return 'Teil-Populationen zuordnen'
      return 'Teil-Populationen zuordnen (aktivierbar, wenn auch Teil-Populationen eingeblendet werden)'
    }
    const mapNameToStoreNameObject = {
      Pop: 'pop',
      Tpop: 'tpop',
      BeobNichtBeurteilt: 'beobNichtBeurteilt',
      BeobNichtZuzuordnen: 'beobNichtZuzuordnen',
      BeobZugeordnet: 'beobZugeordnet',
      BeobZugeordnetAssignPolylines: 'beobZugeordnet',
    }

    return (
      <LayerDiv>
        <Checkbox
          tree={store.tree}
          value={apfloraLayer.value}
          label={apfloraLayer.label}
          checked={activeApfloraLayers.includes(apfloraLayer.value)}
          onChange={() => {
            if (activeApfloraLayers.includes(apfloraLayer.value)) {
              return store.map.removeActiveApfloraLayer(apfloraLayer.value)
            }
            return store.map.addActiveApfloraLayer(apfloraLayer.value)
          }}
        />
        <IconsDiv>
          {['BeobNichtBeurteilt', 'BeobZugeordnet'].includes(
            apfloraLayer.value
          ) && (
            <ZuordnenDiv>
              <StyledIconButton
                title={getZuordnenIconTitle()}
                onClick={() => {
                  if (store.map.activeApfloraLayers.includes('Tpop')) {
                    store.map.beob.toggleAssigning()
                  }
                }}
              >
                {store.map.beob.assigning ? (
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
          {apfloraLayer.value === 'Pop' &&
            activeApfloraLayers.includes('Pop') && (
              <MapIconDiv>
                <PopMapIcon id="PopMapIcon" />
              </MapIconDiv>
            )}
          {apfloraLayer.value === 'Tpop' &&
            activeApfloraLayers.includes('Tpop') && (
              <MapIconDiv>
                <TpopMapIcon id="TpopMapIcon" />
              </MapIconDiv>
            )}
          {apfloraLayer.value === 'BeobNichtBeurteilt' &&
            activeApfloraLayers.includes('BeobNichtBeurteilt') && (
              <MapIconDiv>
                <BeobNichtBeurteiltMapIcon id="BeobNichtBeurteiltMapIcon" />
              </MapIconDiv>
            )}
          {apfloraLayer.value === 'BeobNichtZuzuordnen' &&
            activeApfloraLayers.includes('BeobNichtZuzuordnen') && (
              <MapIconDiv>
                <BeobNichtZuzuordnenMapIcon id="BeobNichtZuzuordnenMapIcon" />
              </MapIconDiv>
            )}
          {apfloraLayer.value === 'BeobZugeordnet' &&
            activeApfloraLayers.includes('BeobZugeordnet') && (
              <MapIconDiv>
                <BeobZugeordnetMapIcon id="BeobZugeordnetMapIcon" />
              </MapIconDiv>
            )}
          {apfloraLayer.value === 'BeobZugeordnetAssignPolylines' &&
            activeApfloraLayers.includes('BeobZugeordnetAssignPolylines') && (
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
                'Pop',
                'Tpop',
                'BeobNichtBeurteilt',
                'BeobNichtZuzuordnen',
                'BeobZugeordnet',
              ].includes(apfloraLayer.value) && (
                <StyledIconButton
                  title="mit Umriss(en) filtern"
                  onClick={() => {
                    if (activeApfloraLayers.includes('MapFilter')) {
                      return store.map.removeActiveApfloraLayer('MapFilter')
                    }
                    store.map.addActiveApfloraLayer('MapFilter')

                    // this does not work, see: https://github.com/Leaflet/Leaflet.draw/issues/708

                    //window.L.Draw.Rectangle.initialize()
                  }}
                >
                  <FilterIcon
                    style={{
                      color: store.map.activeApfloraLayers.includes(
                        apfloraLayer.value
                      )
                        ? 'black'
                        : '#e2e2e2',
                      cursor: store.map.activeApfloraLayers.includes(
                        apfloraLayer.value
                      )
                        ? 'pointer'
                        : 'not-allowed',
                    }}
                  />
                </StyledIconButton>
              )}
            </FilterDiv>
          )}
          <ZoomToDiv>
            {apfloraLayer.value !== 'MapFilter' && (
              <StyledIconButton
                title={`auf alle '${apfloraLayer.label}' zoomen`}
                onClick={() => {
                  if (activeApfloraLayers.includes(apfloraLayer.value)) {
                    store.map.changeBounds(
                      store.map[mapNameToStoreNameObject[apfloraLayer.value]]
                        .bounds
                    )
                  }
                }}
              >
                <ZoomToIcon
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
          </ZoomToDiv>
          <ZoomToDiv>
            {apfloraLayer.value !== 'MapFilter' && (
              <StyledIconButton
                title={`auf aktive '${apfloraLayer.label}' zoomen`}
                onClick={() => {
                  // TODO: if set min bounds
                  // that accords to 50m
                  if (activeApfloraLayers.includes(apfloraLayer.value)) {
                    const bounds =
                      store.map[mapNameToStoreNameObject[apfloraLayer.value]]
                        .boundsOfHighlightedIds
                    // ensure bounds exist
                    if (bounds && bounds.length && bounds.length > 0) {
                      const boundsBuffered = bufferBoundsTo50m(bounds)
                      store.map.changeBounds(boundsBuffered)
                    }
                  }
                }}
              >
                <ZoomToIcon
                  style={{
                    color:
                      activeApfloraLayers.includes(apfloraLayer.value) &&
                      store.map[mapNameToStoreNameObject[apfloraLayer.value]]
                        .highlightedIds.length > 0
                        ? '#fbec04'
                        : '#e2e2e2',
                    fontWeight:
                      activeApfloraLayers.includes(apfloraLayer.value) &&
                      store.map[mapNameToStoreNameObject[apfloraLayer.value]]
                        .highlightedIds.length > 0
                        ? 'bold'
                        : 'normal',
                    cursor:
                      activeApfloraLayers.includes(apfloraLayer.value) &&
                      store.map[mapNameToStoreNameObject[apfloraLayer.value]]
                        .highlightedIds.length > 0
                        ? 'pointer'
                        : 'not-allowed',
                  }}
                />
              </StyledIconButton>
            )}
          </ZoomToDiv>
          <div>
            {!['BeobZugeordnetAssignPolylines', 'MapFilter'].includes(
              apfloraLayer.value
            ) && <DragHandle />}
          </div>
        </IconsDiv>
      </LayerDiv>
    )
  }
)
const SortableList = SortableContainer(
  ({ items, store, activeApfloraLayers }) => (
    <div>
      {items.map((apfloraLayer, index) => (
        <SortableItem
          key={index}
          index={index}
          apfloraLayer={apfloraLayer}
          store={store}
          activeApfloraLayers={activeApfloraLayers}
        />
      ))}
    </div>
  )
)

const ApfloraLayers = ({ store }: { store: Object }) => (
  <CardContent>
    <SortableList
      items={store.map.apfloraLayers}
      onSortEnd={({ oldIndex, newIndex }) =>
        store.map.moveApfloraLayer({
          oldIndex,
          newIndex,
        })
      }
      useDragHandle
      lockAxis="y"
      store={store}
      activeApfloraLayers={toJS(store.map.activeApfloraLayers)}
    />
  </CardContent>
)

export default observer(ApfloraLayers)
