import React, { PropTypes } from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import FontIcon from 'material-ui/FontIcon'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

import Checkbox from './shared/Checkbox'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 5px;
`
const DragHandleIcon = styled(FontIcon)`
  font-size: 18px !important;
  color: #7b7b7b !important;
  cursor: grab;
`
const DragHandleDiv = styled.div`
  padding-left: 3px;
  min-width: 18px;
`
const ZuordnenIcon = styled(FontIcon)`
  font-size: 20px !important;
`
const ZoomToIcon = styled(FontIcon)`
  font-size: 20px !important;
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
`
const MapIcon = styled(FontIcon)`
  margin-right: -0.1em;
  font-size: 20px !important;
  -webkit-text-stroke: 1px black;
  -moz-text-stroke: 1px black;
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
const TpopBeobMapIcon = styled(MapIcon)`
  color: #FF00FF !important;
`
const TpopBeobAssignPolylinesIcon = styled(MapIcon)`
  color: #FF00FF !important;
  -webkit-text-stroke: 0 black;
  -moz-text-stroke: 0 black;
`
const MapIconDiv = styled.div``
/**
 * don't know why but passing store
 * with mobx inject does not work here
 * so passed in from parent
 */

const DragHandle = SortableHandle(() =>
  <DragHandleIcon
    className="material-icons"
    title="ziehen, um Layer höher/tiefer zu stapeln"
  >
    drag_handle
  </DragHandleIcon>
)
const SortableItem = SortableElement(({ apfloraLayer, store, activeApfloraLayers }) => {
  const assigningIsPossible = (
    store.map.activeApfloraLayers.includes(`Tpop`) &&
    (
      (
        store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`) &&
        apfloraLayer.value === `BeobNichtBeurteilt`
      ) ||
      (
        store.map.activeApfloraLayers.includes(`TpopBeob`) &&
        apfloraLayer.value === `TpopBeob`
      )
    )
  )
  const getZuordnenIconTitle = () => {
    if (store.map.beob.assigning) return `Zuordnung beenden`
    if (assigningIsPossible) return `Teil-Populationen zuordnen`
    return `Teil-Populationen zuordnen (aktivierbar, wenn auch Teil-Populationen eingeblendet werden)`
  }
  const mapNameToStoreNameObject = {
    Pop: `pop`,
    Tpop: `tpop`,
    BeobNichtBeurteilt: `beobNichtBeurteilt`,
    BeobNichtZuzuordnen: `beobNichtZuzuordnen`,
    TpopBeob: `tpopBeob`,
    TpopBeobAssignPolylines: `tpopBeob`,
  }

  return (
    <LayerDiv>
      <Checkbox
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
        {
          [`BeobNichtBeurteilt`, `TpopBeob`].includes(apfloraLayer.value) &&
          <ZuordnenDiv>
            <ZuordnenIcon
              className="material-icons"
              title={getZuordnenIconTitle()}
              style={{
                color: assigningIsPossible ? `black` : `#e2e2e2`,
                cursor: assigningIsPossible ? `pointer` : `inherit`,
              }}
              onClick={() => {
                if (store.map.activeApfloraLayers.includes(`Tpop`)) {
                  store.map.beob.toggleAssigning()
                }
              }}
            >
              { store.map.beob.assigning ? `pause_circle_outline` : `play_circle_outline` }
            </ZuordnenIcon>
          </ZuordnenDiv>
        }
        {
          apfloraLayer.value === `Pop` &&
          activeApfloraLayers.includes(`Pop`) &&
          <MapIconDiv>
            <PopMapIcon
              id="PopMapIcon"
              className="material-icons"
            >
              local_florist
            </PopMapIcon>
          </MapIconDiv>
        }
        {
          apfloraLayer.value === `Tpop` &&
          activeApfloraLayers.includes(`Tpop`) &&
          <MapIconDiv>
            <TpopMapIcon
              id="TpopMapIcon"
              className="material-icons"
            >
              local_florist
            </TpopMapIcon>
          </MapIconDiv>
        }
        {
          apfloraLayer.value === `BeobNichtBeurteilt` &&
          activeApfloraLayers.includes(`BeobNichtBeurteilt`) &&
          <MapIconDiv>
            <BeobNichtBeurteiltMapIcon
              id="BeobNichtBeurteiltMapIcon"
              className="material-icons"
            >
              local_florist
            </BeobNichtBeurteiltMapIcon>
          </MapIconDiv>
        }
        {
          apfloraLayer.value === `BeobNichtZuzuordnen` &&
          activeApfloraLayers.includes(`BeobNichtZuzuordnen`) &&
          <MapIconDiv>
            <BeobNichtZuzuordnenMapIcon
              id="BeobNichtZuzuordnenMapIcon"
              className="material-icons"
            >
              local_florist
            </BeobNichtZuzuordnenMapIcon>
          </MapIconDiv>
        }
        {
          apfloraLayer.value === `TpopBeob` &&
          activeApfloraLayers.includes(`TpopBeob`) &&
          <MapIconDiv>
            <TpopBeobMapIcon
              id="TpopBeobMapIcon"
              className="material-icons"
            >
              local_florist
            </TpopBeobMapIcon>
          </MapIconDiv>
        }
        {
          apfloraLayer.value === `TpopBeobAssignPolylines` &&
          activeApfloraLayers.includes(`TpopBeobAssignPolylines`) &&
          <MapIconDiv>
            <TpopBeobAssignPolylinesIcon
              id="TpopBeobAssignPolylinesMapIcon"
              className="material-icons"
            >
              remove
            </TpopBeobAssignPolylinesIcon>
          </MapIconDiv>
        }
        <ZoomToDiv>
          {
            apfloraLayer.value !== `MapFilter` &&
            <ZoomToIcon
              className="material-icons"
              title={`auf alle '${apfloraLayer.label}' zoomen`}
              style={{
                color: activeApfloraLayers.includes(apfloraLayer.value) ? `black` : `#e2e2e2`,
                cursor: activeApfloraLayers.includes(apfloraLayer.value) ? `pointer` : `inherit`,
              }}
              onClick={() => {
                if (activeApfloraLayers.includes(apfloraLayer.value)) {
                  store.map.changeBounds(
                    store.map[mapNameToStoreNameObject[apfloraLayer.value]].bounds
                  )
                }
              }}
            >
              filter_center_focus
            </ZoomToIcon>
          }
        </ZoomToDiv>
        <ZoomToDiv>
          {
            apfloraLayer.value !== `MapFilter` &&
            <ZoomToIcon
              className="material-icons"
              title={`auf aktive '${apfloraLayer.label}' zoomen`}
              style={{
                color: (
                  (
                    activeApfloraLayers.includes(apfloraLayer.value) &&
                    store.map[mapNameToStoreNameObject[apfloraLayer.value]].highlightedIds.length > 0
                  ) ?
                  `#fbec04` :
                  `#e2e2e2`
                ),
                  fontWeight: (
                    (
                      activeApfloraLayers.includes(apfloraLayer.value) &&
                      store.map[mapNameToStoreNameObject[apfloraLayer.value]].highlightedIds.length > 0
                    ) ?
                    `bold` :
                    `normal`
                  ),
                cursor: (
                  (
                    activeApfloraLayers.includes(apfloraLayer.value) &&
                    store.map[mapNameToStoreNameObject[apfloraLayer.value]].highlightedIds.length > 0
                  ) ?
                  `pointer` :
                  `inherit`
                ),
              }}
              onClick={() => {
                if (activeApfloraLayers.includes(apfloraLayer.value)) {
                  store.map.changeBounds(store.map[mapNameToStoreNameObject[apfloraLayer.value]].boundsOfHighlightedIds)
                }
              }}
            >
              filter_center_focus
            </ZoomToIcon>
          }
        </ZoomToDiv>
        <DragHandleDiv>
          {
            apfloraLayer.value !== `TpopBeobAssignPolylines` &&
            apfloraLayer.value !== `MapFilter` &&
            <DragHandle />
          }
        </DragHandleDiv>
      </IconsDiv>
    </LayerDiv>
)
})
const SortableList = SortableContainer(({ items, store, activeApfloraLayers }) =>
  <div>
    {
      items.map((apfloraLayer, index) =>
        <SortableItem
          key={index}
          index={index}
          apfloraLayer={apfloraLayer}
          store={store}
          activeApfloraLayers={activeApfloraLayers}
        />
      )
    }
  </div>
)

const ApfloraLayers = ({ store }) =>
  <CardContent>
    <SortableList
      items={store.map.apfloraLayers}
      onSortEnd={({ oldIndex, newIndex }) =>
        store.map.moveApfloraLayer({ oldIndex, newIndex })
      }
      useDragHandle
      lockAxis="y"
      store={store}
      activeApfloraLayers={toJS(store.map.activeApfloraLayers)}
    />
  </CardContent>

ApfloraLayers.propTypes = {
  store: PropTypes.object.isRequired,
}

export default observer(ApfloraLayers)
