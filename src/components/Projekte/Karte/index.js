// @flow
/*
 *
 * Karte
 * swisstopo wmts: https://wmts10.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml
 *
 */

import React, { useContext, useRef, useEffect } from 'react'
import { Map, ScaleControl } from 'react-leaflet'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withProps from 'recompose/withProps'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'
import debounceHandler from '@hocs/debounce-handler'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { withApollo } from 'react-apollo'

import LayersControl from './LayersControl'
import OsmColor from './layers/OsmColor'
import OsmBw from './layers/OsmBw'
import SwissTopoPixelFarbe from './layers/SwisstopoPixelFarbe'
import SwissTopoPixelGrau from './layers/SwisstopoPixelGrau'
import SwisstopoSiegfried from './layers/SwisstopoSiegfried'
import SwisstopoDufour from './layers/SwisstopoDufour'
//import BingAerial from './layers/BingAerial'
import ZhOrtho from './layers/ZhOrtho'
import ZhOrthoIr from './layers/ZhOrthoIr'
import ZhOrtho2015 from './layers/ZhOrtho2015'
import ZhOrtho2015Ir from './layers/ZhOrtho2015Ir'
import ZhUep from './layers/ZhUep'
import Detailplaene from './layers/Detailplaene'
import Markierungen from './layers/Markierungen'
import ZhSvoColor from './layers/ZhSvoColor'
import ZhPflegeplan from './layers/ZhPflegeplan'
import ZhSvoGrey from './layers/ZhSvoGrey'
import ZhLrVegKartierungen from './layers/ZhLrVegKartierungen'
import ZhLichteWaelder from './layers/ZhLichteWaelder'
import ZhGemeindegrenzen from './layers/ZhGemeindegrenzen'
import ZhWaelderVegetation from './layers/ZhWaelderVegetation'
import ZhUepOverlay from './layers/ZhUepOverlay'
import '../../../../node_modules/leaflet/dist/leaflet.css'
import '../../../../node_modules/leaflet-measure/dist/leaflet-measure.css'
import '../../../../node_modules/leaflet-draw/dist/leaflet.draw.css'
import '../../../../node_modules/leaflet.markercluster/dist/MarkerCluster.css'
import Pop from './layers/PopMarker'
import Tpop from './layers/TpopMarker'
import BeobNichtBeurteilt from './layers/BeobNichtBeurteilt'
import BeobNichtZuzuordnen from './layers/BeobNichtZuzuordnen'
import BeobZugeordnet from './layers/BeobZugeordnet'
import BeobZugeordnetAssignPolylines from './layers/BeobZugeordnetAssignPolylines'
import MeasureControl from './MeasureControl'
import FullScreenControl from './FullScreenControl'
import SwitchScaleControl from './ScaleControl'
import DrawControl from './DrawControl'
// import PrintControl from './PrintControl'
import PngControl from './PngControl'
import CoordinatesControl from './CoordinatesControl/index.js'
import epsg4326to2056 from '../../../modules/epsg4326to2056'
import ErrorBoundary from '../../shared/ErrorBoundary'
import updateTpopById from './updateTpopById'

import mobxStoreContext from '../../../mobxStoreContext'
import usePrevious from '../../../modules/usePrevious'
//import getBounds from '../../../modules/getBounds'

// this does not work
// see issue on proj4js: https://github.com/proj4js/proj4js/issues/214
/*
const crs = new window.L.Proj.CRS(
  'EPSG:2056',
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
  {
    resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
    bounds,
  }
)*/

const StyledMap = styled(Map)`
  height: 100%;
  cursor: ${props => (props.localizing ? 'crosshair' : 'grab')} !important;
  @media print {
    height: 100%;
    width: 100%;
    overflow: visible;
  }
`
const Container = styled.div`
  border-left-color: rgb(46, 125, 50);
  border-left-width: 1px;
  border-left-style: solid;
  border-right-color: rgb(46, 125, 50);
  border-right-width: 1px;
  border-right-style: solid;
  height: 100%;
  overflow: hidden;
`

/**
 * DO NOT use component state / props to track mouseCoordinates
 * Reason: when state variable is updated, map is re-drawn
 * which results in a hideous flash (and unusability if not debounced)
 * So: need to use app level store state
 */

const enhance = compose(
  withApollo,
  withProps(() => {
    const { setMapMouseCoordinates } = useContext(mobxStoreContext)
    return { setMapMouseCoordinates }
  }),
  withHandlers({
    onMouseMove: ({ setMapMouseCoordinates }) => e => {
      const [x, y] = epsg4326to2056(e.latlng.lng, e.latlng.lat)
      setMapMouseCoordinates({ x, y })
    },
  }),
  debounceHandler('onMouseMove', 15),
  observer,
)

const Karte = ({
  tree,
  activeNodes,
  onMouseMove,
  data,
  refetchTree,
  mapIdsFiltered,
  mapPopIdsFiltered,
  mapTpopIdsFiltered,
  mapBeobNichtBeurteiltIdsFiltered,
  mapBeobZugeordnetIdsFiltered,
  mapBeobNichtZuzuordnenIdsFiltered,
  dimensions,
  client,
}: {
  tree: Object,
  activeNodes: Object,
  onMouseMove: () => void,
  data: Object,
  refetchTree: () => void,
  mapIdsFiltered: Array<String>,
  mapPopIdsFiltered: Array<String>,
  mapTpopIdsFiltered: Array<String>,
  mapBeobNichtBeurteiltIdsFiltered: Array<String>,
  mapBeobZugeordnetIdsFiltered: Array<String>,
  mapBeobNichtZuzuordnenIdsFiltered: Array<String>,
  dimensions: Object,
  client: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const {
    apfloraLayers,
    activeApfloraLayers,
    overlays,
    activeOverlays,
    activeBaseLayer,
    popLabelUsingNr,
    idOfTpopBeingLocalized,
    setIdOfTpopBeingLocalized,
    bounds,
    addError,
    assigningBeob,
  } = mobxStore

  const mapRef = useRef(null)

  const prevDimensions = usePrevious(dimensions) || {}

  useEffect(
    () => {
      const prevWidth = prevDimensions.width || 0
      // DANGER: first width is '100%'!
      if (Number.isInteger(prevWidth)) {
        const width = dimensions.width
        const widthHasChangedByOver20Percent =
          prevWidth / width > 1.2 || prevWidth / width < 0.8
        if (widthHasChangedByOver20Percent) {
          /**
           * need to redraw map, when tabs changed
           * unfortunately, tabs change in previous update, so can't compare tabs
           */
          const map = mapRef.current.leafletElement
          map.invalidateSize()
        }
      }
    },
    [dimensions.width],
  )

  const clustered = !(
    assigningBeob ||
    activeApfloraLayers.includes('beobZugeordnetAssignPolylines')
  )
  /**
   * need an object whose methods return overlays
   * in order to dynamically display and sort active overlays
   */
  const ApfloraLayerComponents = {
    // MapFilter is used for filtering, need to return null
    mapFilter: () => null,
    pop: () => (
      <Pop
        tree={tree}
        data={data}
        activeNodes={activeNodes}
        activeApfloraLayers={activeApfloraLayers}
        popLabelUsingNr={popLabelUsingNr}
        mapIdsFiltered={mapIdsFiltered}
      />
    ),
    tpop: () => (
      <Tpop
        tree={tree}
        data={data}
        activeNodes={activeNodes}
        clustered={clustered}
        mapIdsFiltered={mapIdsFiltered}
      />
    ),
    beobNichtBeurteilt: () => (
      <BeobNichtBeurteilt
        tree={tree}
        data={data}
        activeNodes={activeNodes}
        clustered={clustered}
        refetchTree={refetchTree}
        mapIdsFiltered={mapIdsFiltered}
      />
    ),
    beobNichtZuzuordnen: () => (
      <BeobNichtZuzuordnen
        tree={tree}
        data={data}
        activeNodes={activeNodes}
        clustered={clustered}
        mapIdsFiltered={mapIdsFiltered}
      />
    ),
    beobZugeordnet: () => (
      <BeobZugeordnet
        tree={tree}
        data={data}
        activeNodes={activeNodes}
        clustered={clustered}
        refetchTree={refetchTree}
        mapIdsFiltered={mapIdsFiltered}
      />
    ),
    beobZugeordnetAssignPolylines: () => (
      <BeobZugeordnetAssignPolylines
        data={data}
        tree={tree}
        activeNodes={activeNodes}
        mapIdsFiltered={mapIdsFiltered}
      />
    ),
  }
  const OverlayComponents = {
    ZhUep: () => <ZhUepOverlay />,
    Detailplaene: () => <Detailplaene />,
    Markierungen: () => <Markierungen />,
    ZhGemeindegrenzen: () => <ZhGemeindegrenzen />,
    ZhSvoColor: () => <ZhSvoColor />,
    ZhSvoGrey: () => <ZhSvoGrey />,
    ZhPflegeplan: () => <ZhPflegeplan />,
    ZhLrVegKartierungen: () => <ZhLrVegKartierungen />,
    ZhLichteWaelder: () => <ZhLichteWaelder />,
    ZhWaelderVegetation: () => <ZhWaelderVegetation />,
  }
  const BaseLayerComponents = {
    OsmColor: () => <OsmColor />,
    OsmBw: () => <OsmBw />,
    SwissTopoPixelFarbe: () => <SwissTopoPixelFarbe />,
    SwissTopoPixelGrau: () => <SwissTopoPixelGrau />,
    SwisstopoSiegfried: () => <SwisstopoSiegfried />,
    SwisstopoDufour: () => <SwisstopoDufour />,
    ZhUep: () => <ZhUep />,
    //BingAerial: () => <BingAerial />,
    ZhOrtho: () => <ZhOrtho />,
    ZhOrthoIr: () => <ZhOrthoIr />,
    ZhOrtho2015: () => <ZhOrtho2015 />,
    ZhOrtho2015Ir: () => <ZhOrtho2015Ir />,
  }
  const BaseLayerComponent = BaseLayerComponents[activeBaseLayer]
  const activeApfloraLayersSorted = sortBy(
    activeApfloraLayers,
    activeApfloraLayer =>
      apfloraLayers.findIndex(
        apfloraLayer => apfloraLayer.value === activeApfloraLayer,
      ),
  )
  const activeOverlaysSorted = sortBy(activeOverlays, activeOverlay =>
    overlays.findIndex(o => o.value === activeOverlay),
  )

  return (
    <Container>
      <ErrorBoundary>
        <StyledMap
          localizing={!!idOfTpopBeingLocalized}
          ref={mapRef}
          bounds={bounds}
          //preferCanvas
          onMouseMove={onMouseMove}
          // need max and min zoom because otherwise
          // something errors
          // probably clustering function
          maxZoom={22}
          minZoom={0}
          doubleClickZoom={false}
          onDblclick={async event => {
            // since 2018 10 31 using idOfTpopBeingLocalized directly
            // returns null, so need to use mobxStore.idOfTpopBeingLocalized
            const { idOfTpopBeingLocalized } = mobxStore
            /**
             * TODO
             * When clicking on Layertool
             * somehow Mapelement grabs the click event
             * although Layertool lies _over_ map element ??!!
             * So when localizing, if user wants to change base map,
             * click on Layertool sets new coordinates!
             */
            if (!!idOfTpopBeingLocalized) {
              const { lat, lng } = event.latlng
              const [x, y] = epsg4326to2056(lng, lat)
              // DANGER:
              // need to stop propagation of the event
              // if not it is called a second time
              // the crazy thing is:
              // in some areas (not all) the second event
              // has wrong coordinates!!!!
              window.L.DomEvent.stopPropagation(event)
              try {
                await client.mutate({
                  mutation: updateTpopById,
                  variables: {
                    id: idOfTpopBeingLocalized,
                    x,
                    y,
                  },
                  /*optimisticResponse: {
                      __typename: 'Mutation',
                      updateTpopById: {
                        tpop: {
                          id: idOfTpopBeingLocalized,
                          x,
                          y,
                          __typename: 'Tpop',
                        },
                        __typename: 'Tpop',
                      },
                    },*/
                })
                // refetch so it appears on map
                refetchTree('tpopForMap')
              } catch (error) {
                addError(error)
              }
              setIdOfTpopBeingLocalized(null)
            }
          }}
          // turned off because caused cyclic zooming
          /*
            onZoomlevelschange={event => {
              // need to update bounds, otherwise map jumps back
              // when adding new tpop
              const mapBounds = event.target.getBounds()
              setBounds([mapBounds._southWest, mapBounds._northEast])
            }}
            onZoomend={event => {
              // need to update bounds, otherwise map jumps back
              const mapBounds = event.target.getBounds()
              setBounds([mapBounds._southWest, mapBounds._northEast])
            }}
            onMoveend={event => {
              // need to update bounds, otherwise map jumps back
              const mapBounds = event.target.getBounds()
              setBounds([mapBounds._southWest, mapBounds._northEast])
            }}*/
        >
          {activeBaseLayer && <BaseLayerComponent />}
          {activeOverlaysSorted
            .map((overlayName, index) => {
              const OverlayComponent = OverlayComponents[overlayName]
              return <OverlayComponent key={index} />
            })
            .reverse()}
          {activeApfloraLayersSorted
            .map((apfloraLayerName, index) => {
              const ApfloraLayerComponent =
                ApfloraLayerComponents[apfloraLayerName]
              return <ApfloraLayerComponent key={index} />
            })
            .reverse()}
          <ScaleControl imperial={false} />
          <LayersControl
            data={data}
            tree={tree}
            activeNodes={activeNodes}
            mapIdsFiltered={mapIdsFiltered}
            mapPopIdsFiltered={mapPopIdsFiltered}
            mapTpopIdsFiltered={mapTpopIdsFiltered}
            mapBeobNichtBeurteiltIdsFiltered={mapBeobNichtBeurteiltIdsFiltered}
            mapBeobNichtZuzuordnenIdsFiltered={
              mapBeobNichtZuzuordnenIdsFiltered
            }
            mapBeobZugeordnetIdsFiltered={mapBeobZugeordnetIdsFiltered}
            // this enforces rerendering when sorting changes
            activeOverlaysString={activeOverlays.join()}
            activeApfloraLayersString={activeApfloraLayers.join()}
          />
          <MeasureControl />
          <SwitchScaleControl />
          <FullScreenControl />
          {activeApfloraLayers.includes('mapFilter') && <DrawControl />}
          {/*
            need to get background maps to show when printing A4
            <PrintControl />
            */}
          <PngControl />
          <CoordinatesControl />
        </StyledMap>
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(Karte)
