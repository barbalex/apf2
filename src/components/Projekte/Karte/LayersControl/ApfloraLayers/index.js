import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
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
  arrayMove,
} from 'react-sortable-hoc'
import 'leaflet'
import 'leaflet-draw'
import { ApolloProvider, Query } from 'react-apollo'
import app from 'ampersand-app'
import get from 'lodash/get'

import Checkbox from '../shared/Checkbox'
import bufferBoundsTo50m from '../../../../../modules/bufferBoundsTo50m'
import dataGql from './data.graphql'
import setAssigningBeob from './setAssigningBeob.graphql'
import getBounds from '../../../../../modules/getBounds'

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
  ({
    apfloraLayer,
    store,
    activeNodes,
    activeApfloraLayers,
    setActiveApfloraLayers,
    data,
    client,
    bounds,
    setBounds,
  }) => {
    const assigning = get(data, 'assigningBeob')
    const assigningispossible =
      activeApfloraLayers.includes('tpop') &&
      (
        (
          activeApfloraLayers.includes('beobNichtBeurteilt') &&
          apfloraLayer.value === 'beobNichtBeurteilt'
        ) ||
        (
          activeApfloraLayers.includes('beobZugeordnet') &&
          apfloraLayer.value === 'beobZugeordnet'
        )
      )
    const getZuordnenIconTitle = () => {
      if (assigning) return 'Zuordnung beenden'
      if (assigningispossible) return 'Teil-Populationen zuordnen'
      return 'Teil-Populationen zuordnen (aktivierbar, wenn auch Teil-Populationen eingeblendet werden)'
    }
    const mapNameToStoreNameObject = {
      pop: 'pop',
      tpop: 'tpop',
      beobNichtBeurteilt: 'beobNichtBeurteilt',
      beobNichtZuzuordnen: 'beobNichtZuzuordnen',
      beobZugeordnet: 'beobZugeordnet',
      beobZugeordnetAssignPolylines: 'beobZugeordnet',
    }
    console.log('ApfloraLayers:', {data})

    return (
      <LayerDiv>
        <Checkbox
          value={apfloraLayer.value}
          label={apfloraLayer.label}
          checked={activeApfloraLayers.includes(apfloraLayer.value)}
          onChange={() => {
            if (activeApfloraLayers.includes(apfloraLayer.value)) {
              return setActiveApfloraLayers(
                activeApfloraLayers.filter(l => l !== apfloraLayer.value)
              )
            }
            return setActiveApfloraLayers([...activeApfloraLayers, apfloraLayer.value])
          }}
        />
        <IconsDiv>
          {['beobNichtBeurteilt', 'beobZugeordnet'].includes(
            apfloraLayer.value
          ) && (
            <ZuordnenDiv>
              <StyledIconButton
                title={getZuordnenIconTitle()}
                onClick={() => {
                  if (activeApfloraLayers.includes('tpop')) {
                    client.mutate({
                      mutation: setAssigningBeob,
                      variables: { value: !assigning }
                    })
                  }
                }}
              >
                {assigning ? (
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
                        activeApfloraLayers.filter(l => l !== 'mapFilter')
                      )
                    }
                    setActiveApfloraLayers([...activeApfloraLayers, 'mapFilter'])
                    // this does not work, see: https://github.com/Leaflet/Leaflet.draw/issues/708
                    //window.L.Draw.Rectangle.initialize()
                  }}
                >
                  <FilterIcon
                    style={{
                      color: activeApfloraLayers.includes(
                        apfloraLayer.value
                      )
                        ? 'black'
                        : '#e2e2e2',
                      cursor: activeApfloraLayers.includes(
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
            {apfloraLayer.value !== 'mapFilter' && (
              <StyledIconButton
                title={`auf alle '${apfloraLayer.label}' zoomen`}
                onClick={() => {
                  if (activeApfloraLayers.includes(apfloraLayer.value)) {
                    switch (apfloraLayer.value) {
                      case 'pop':
                        setBounds(
                          getBounds(
                            get(data, 'pops.nodes', [])
                          )
                        )
                        break
                      case 'tpop':
                        setBounds(
                          getBounds(
                            get(data, 'tpops.nodes', [])
                          )
                        )
                        break
                      case 'beobNichtBeurteilt':
                        setBounds(
                          getBounds(
                            get(data, 'beobNichtBeurteilts.nodes', [])
                          )
                        )
                        break
                      case 'beobNichtZuzuordnen':
                        setBounds(
                          getBounds(
                            get(data, 'beobNichtZuzuordnens.nodes', [])
                          )
                        )
                        break
                      case 'beobZugeordnet':
                      case 'beobZugeordnetAssignPolylines':
                        setBounds(
                          getBounds(
                            get(data, 'beobZugeordnets.nodes', [])
                          )
                        )
                        break
                      default:
                        // do nothing
                    }
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
            {apfloraLayer.value !== 'mapFilter' && (
              <StyledIconButton
                title={`auf aktive '${apfloraLayer.label}' zoomen`}
                onClick={() => {
                  // TODO: if set min bounds
                  // that accords to 50m
                  // TODO: use bounds passed with props
                  // wait til mapFilter is in gql
                  if (activeApfloraLayers.includes(apfloraLayer.value)) {
                    let bounds
                    switch (apfloraLayer.value) {
                      case 'pop':
                        // TODO
                        break
                      case 'tpop':
                        // TODO
                        break
                      default:
                      // nothing
                    }
                    bounds =
                      store.map[mapNameToStoreNameObject[apfloraLayer.value]]
                        .boundsOfHighlightedIds
                    // ensure bounds exist
                    if (bounds && bounds.length && bounds.length > 0) {
                      const boundsBuffered = bufferBoundsTo50m(bounds)
                      setBounds(boundsBuffered)
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
            {!['beobZugeordnetAssignPolylines', 'mapFilter'].includes(
              apfloraLayer.value
            ) && <DragHandle />}
          </div>
        </IconsDiv>
      </LayerDiv>
    )
  }
)
const SortableList = SortableContainer(
  ({
    items,
    store,
    activeApfloraLayers,
    setActiveApfloraLayers,
    data,
    client,
    bounds,
    setBounds,
  }) => (
    <div>
      {
        items.map((apfloraLayer, index) => (
          <SortableItem
            key={index}
            index={index}
            apfloraLayer={apfloraLayer}
            store={store}
            activeApfloraLayers={activeApfloraLayers}
            setActiveApfloraLayers={setActiveApfloraLayers}
            data={data}
            client={client}
            bounds={bounds}
            setBounds={setBounds}
          />
        ))
      }
    </div>
  )
)

const ApfloraLayers = ({
  store,
  activeNodes,
  apfloraLayers,
  setApfloraLayers,
  activeApfloraLayers,
  setActiveApfloraLayers,
  bounds,
  setBounds,
  popBounds,
  setPopBounds,
  tpopBounds,
  setTpopBounds,
}: {
  store: Object,
  activeNodes: Object,
  apfloraLayers: Array<Object>,
  setApfloraLayers: () => void,
  activeApfloraLayers: Array<Object>,
  setActiveApfloraLayers: () => void,
  bounds: Array<Array<Number>>,
  setBounds: () => void,
  popBounds: Array<Array<Number>>,
  setPopBounds: () => void,
  tpopBounds: Array<Array<Number>>,
  setTpopBounds: () => void,
}) => (
  <ApolloProvider client={app.client}>
    <Query
      query={dataGql}
      variables={{
        isAp: !!activeNodes.ap,
        ap: activeNodes.ap ? [activeNodes.ap] : [],
        isPop: !!activeNodes.pop,
        pop: activeNodes.pop ? [activeNodes.pop] : [],
      }}
    >
      {({ loading, error, data, client }) => {
        if (error) return `Fehler: ${error.message}`

        return (
          <CardContent>
            <SortableList
              items={apfloraLayers}
              onSortEnd={({ oldIndex, newIndex }) =>
                setApfloraLayers(arrayMove(apfloraLayers, oldIndex, newIndex))
              }
              useDragHandle
              lockAxis="y"
              store={store}
              activeApfloraLayers={activeApfloraLayers}
              setActiveApfloraLayers={setActiveApfloraLayers}
              data={data}
              client={client}
              bounds={bounds}
              setBounds={setBounds}
            />
          </CardContent>
        )
      }}
    </Query>
  </ApolloProvider>
)

export default observer(ApfloraLayers)
