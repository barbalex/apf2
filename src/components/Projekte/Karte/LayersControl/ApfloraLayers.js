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
  font-size: 18px !important;
`
const LayerDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  &:last-of-type {
    padding-bottom: 4px;
  }
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
const MapIcon = styled(FontIcon)`
  margin-right: -0.1em;
  font-size: 20px !important;
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
  color: #9a009a !important;
`
const TpopBeobMapIcon = styled(MapIcon)`
  color: #FF00FF !important;
`
const TpopBeobAssignPolylinesIcon = styled(MapIcon)`
  color: #FF00FF !important;
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
              title={store.map.beob.assigning ? `Zuordnung beenden` : `Teil-Populationen zuordnen`}
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
        <DragHandleDiv>
          {
            apfloraLayer.value !== `TpopBeobAssignPolylines` &&
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
