// @flow
/*
 *
 * Karte
 * swisstopo wmts: https://wmts10.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml
 *
 */

import React from 'react'
import { Map, ScaleControl } from 'react-leaflet'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import gql from 'graphql-tag'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'
import debounceHandler from '@hocs/debounce-handler'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
import app from 'ampersand-app'

import LayersControl from './LayersControl'
import OsmColor from './layers/OsmColor'
import OsmBw from './layers/OsmBw'
import SwissTopoPixelFarbe from './layers/SwisstopoPixelFarbe'
import SwissTopoPixelGrau from './layers/SwisstopoPixelGrau'
import SwisstopoSiegfried from './layers/SwisstopoSiegfried'
import SwisstopoDufour from './layers/SwisstopoDufour'
import BingAerial from './layers/BingAerial'
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
import DrawControl from './DrawControl'
// import PrintControl from './PrintControl'
import PngControl from './PngControl'
import CoordinatesControl from './CoordinatesControl/index.js'
import epsg4326to2056 from '../../../modules/epsg4326to2056'
import ErrorBoundary from '../../shared/ErrorBoundary'
import updateTpopById from './updateTpopById.graphql'
import listError from '../../../modules/listError';
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
  @media print {
    height: 100%;
    width: 100%;
    overflow: visible;
  }
`
const StyledMapLocalizing = styled(StyledMap)`
  cursor: crosshair !important;
`

/**
 * DO NOT use component state / props to track mouseCoordinates
 * Reason: when state variable is updated, map is re-drawn
 * which results in a hideous flash (and unusability if not debounced)
 * So: need to use app level store state
 */

const enhance = compose(
  withHandlers({
    onMouseMove: ({ setMouseCoordinates }) => (e) => {
      const { client } = app
      const [x, y] = epsg4326to2056(e.latlng.lng, e.latlng.lat)
      client.mutate({
        mutation: gql`
          mutation setMapMouseCoordinates($x: Number!, $y: Number!) {
            setMapMouseCoordinates(x: $x, y: $y) @client {
              x
              y
            }
          }
        `,
        variables: { x, y }
      })
    }
  }),
  debounceHandler('onMouseMove', 15),
)

const Karte = ({
  tree,
  activeNodes,
  onMouseMove,
  data,
  activeBaseLayer,
  setActiveBaseLayer,
  apfloraLayers,
  setApfloraLayers,
  activeApfloraLayers,
  setActiveApfloraLayers,
  overlays,
  setOverlays,
  activeOverlays,
  setActiveOverlays,
  client,
  refetchTree,
  idOfTpopBeingLocalized,
  setIdOfTpopBeingLocalized,
  tpopLabelUsingNr,
  popLabelUsingNr,
  bounds,
  setBounds,
  mapIdsFiltered,
  mapPopIdsFiltered,
  mapTpopIdsFiltered,
  mapBeobNichtBeurteiltIdsFiltered,
  mapBeobNichtZuzuordnenIdsFiltered,
  mapBeobZugeordnetIdsFiltered,
  mapFilter,
  setMapFilter,
}: {
  tree: Object,
  activeNodes: Object,
  onMouseMove: () => void,
  data: Object,
  activeBaseLayer: String,
  setActiveBaseLayer: () => void,
  apfloraLayers: Array<Object>,
  setApfloraLayers: () => void,
  activeApfloraLayers: Array<Object>,
  setActiveApfloraLayers: () => void,
  overlays: Array<Object>,
  setOverlays: () => void,
  activeOverlays: Array<String>,
  setActiveOverlays: () => void,
  client: Object,
  refetchTree: () => void,
  idOfTpopBeingLocalized: String,
  setIdOfTpopBeingLocalized: () => void,
  tpopLabelUsingNr: Boolean,
  popLabelUsingNr: Boolean,
  bounds: Array<Array<Number>>,
  setBounds: () => void,
  mapIdsFiltered: Array<String>,
  mapFilter: Object,
  setMapFilter: () => void,
  mapPopIdsFiltered: Array<String>,
  mapTpopIdsFiltered: Array<String>,
  mapBeobNichtBeurteiltIdsFiltered: Array<String>,
  mapBeobZugeordnetIdsFiltered: Array<String>,
  mapBeobNichtZuzuordnenIdsFiltered: Array<String>,
}) => {
    const MapElement = !!idOfTpopBeingLocalized ? StyledMapLocalizing : StyledMap
    const assigning = get(data, 'assigningBeob')
    const clustered = !(assigning || activeApfloraLayers.includes('beobZugeordnetAssignPolylines'))
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
          activeNodes={activeNodes}
          apfloraLayers={apfloraLayers}
          activeApfloraLayers={activeApfloraLayers}
          popLabelUsingNr={popLabelUsingNr}
          mapIdsFiltered={mapIdsFiltered}
        />
      ),
      tpop: () => (
        <Tpop
          tree={tree}
          activeNodes={activeNodes}
          apfloraLayers={apfloraLayers}
          clustered={clustered}
          tpopLabelUsingNr={tpopLabelUsingNr}
          mapIdsFiltered={mapIdsFiltered}
        />
      ),
      beobNichtBeurteilt: () => (
        <BeobNichtBeurteilt
          tree={tree}
          activeNodes={activeNodes}
          apfloraLayers={apfloraLayers}
          clustered={clustered}
          refetchTree={refetchTree}
          mapIdsFiltered={mapIdsFiltered}
        />
      ),
      beobNichtZuzuordnen: () => (
        <BeobNichtZuzuordnen
          tree={tree}
          activeNodes={activeNodes}
          apfloraLayers={apfloraLayers}
          clustered={clustered}
          mapIdsFiltered={mapIdsFiltered}
        />
      ),
      beobZugeordnet: () => (
        <BeobZugeordnet
          tree={tree}
          activeNodes={activeNodes}
          apfloraLayers={apfloraLayers}
          clustered={clustered}
          refetchTree={refetchTree}
          mapIdsFiltered={mapIdsFiltered}
        />
      ),
      beobZugeordnetAssignPolylines: () => (
        <BeobZugeordnetAssignPolylines
          tree={tree}
          activeNodes={activeNodes}
          mapIdsFiltered={mapIdsFiltered}
        />
      )
    }
    const OverlayComponents = {
      ZhUep: () => <ZhUepOverlay />,
      Detailplaene: () =>
        <Detailplaene
          client={client}
          treeName={tree.name}
          detailplaene={get(data, 'map.detailplaene')}
        />,
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
      BingAerial: () => <BingAerial />,
      ZhOrtho: () => <ZhOrtho />,
      ZhOrthoIr: () => <ZhOrthoIr />,
      ZhOrtho2015: () => <ZhOrtho2015 />,
      ZhOrtho2015Ir: () => <ZhOrtho2015Ir />,
    }
    const BaseLayerComponent = BaseLayerComponents[activeBaseLayer]
    const activeApfloraLayersSorted = sortBy(activeApfloraLayers, activeApfloraLayer =>
      apfloraLayers.findIndex(
        apfloraLayer => apfloraLayer.value === activeApfloraLayer
      )
    )
    const activeOverlaysSorted = sortBy(activeOverlays, activeOverlay =>
      overlays.findIndex(o => o.value === activeOverlay)
    )
  
    return (
      <ErrorBoundary>
        <MapElement
          bounds={bounds}
          preferCanvas
          onMouseMove={onMouseMove}
          // need max and min zoom because otherwise
          // something errors
          // probably clustering function
          maxZoom={22}
          minZoom={0}
          onClick={async event => {
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
              try {
                client.mutate({
                  mutation: updateTpopById,
                  variables: {
                    id: idOfTpopBeingLocalized,
                    x,
                    y
                  },
                  optimisticResponse: {
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
                  },
                })
              } catch (error) {
                listError(error)
              }
              setIdOfTpopBeingLocalized(null)
            }
          }}
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
          }}
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
              const ApfloraLayerComponent = ApfloraLayerComponents[apfloraLayerName]
              return <ApfloraLayerComponent key={index} />
            })
            .reverse()
          }
          <ScaleControl imperial={false} />
          <LayersControl
            data={data}
            tree={tree}
            activeNodes={activeNodes}
            activeBaseLayer={activeBaseLayer}
            setActiveBaseLayer={setActiveBaseLayer}
            apfloraLayers={apfloraLayers}
            setApfloraLayers={setApfloraLayers}
            activeApfloraLayers={activeApfloraLayers}
            setActiveApfloraLayers={setActiveApfloraLayers}
            overlays={overlays}
            setOverlays={setOverlays}
            activeOverlays={activeOverlays}
            setActiveOverlays={setActiveOverlays}
            bounds={bounds}
            setBounds={setBounds}
            mapFilter={mapFilter}
            mapIdsFiltered={mapIdsFiltered}
            mapPopIdsFiltered={mapPopIdsFiltered}
            mapTpopIdsFiltered={mapTpopIdsFiltered}
            mapBeobNichtBeurteiltIdsFiltered={mapBeobNichtBeurteiltIdsFiltered}
            mapBeobNichtZuzuordnenIdsFiltered={mapBeobNichtZuzuordnenIdsFiltered}
            mapBeobZugeordnetIdsFiltered={mapBeobZugeordnetIdsFiltered}
            // this enforces rerendering when sorting changes
            activeOverlaysString={activeOverlays.join()}
            activeApfloraLayersString={activeApfloraLayers.join()}
          />
          <MeasureControl />
          <FullScreenControl />
          {
            activeApfloraLayers.includes('mapFilter') &&
            <DrawControl setStoreMapFilter={setMapFilter} />
            }
          {/*
          need to get background maps to show when printing A4
          <PrintControl />
          */}
          <PngControl />
          <CoordinatesControl />
        </MapElement>
      </ErrorBoundary>
    )
  }

export default enhance(Karte)
