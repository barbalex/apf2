// @flow
/*
 *
 * Karte
 * swisstopo wmts: https://wmts10.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml
 *
 */

import React, {
  useContext,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { Map, ScaleControl } from 'react-leaflet'
import styled from 'styled-components'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'
import sortBy from 'lodash/sortBy'
import debounce from 'lodash/debounce'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { useApolloClient } from 'react-apollo-hooks'

import LayersControl from './LayersControl'
import OsmColor from './layers/OsmColor'
import OsmBw from './layers/OsmBw'
import SwissTopoPixelFarbe from './layers/SwisstopoPixelFarbe'
import SwissTopoPixelGrau from './layers/SwisstopoPixelGrau'
import SwisstopoSiegfried from './layers/SwisstopoSiegfried'
import SwisstopoDufour from './layers/SwisstopoDufour'
//import BingAerial from './layers/BingAerial'
import ZhOrtho2014Rgb from './layers/ZhOrtho2014Rgb'
import ZhOrtho2014Ir from './layers/ZhOrtho2014Ir'
import ZhOrtho2015Rgb from './layers/ZhOrtho2015Rgb'
import ZhOrtho2018Rgb from './layers/ZhOrtho2018Rgb'
import ZhOrtho2018Ir from './layers/ZhOrtho2018Ir'
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
import Pop from './layers/Pop'
import Tpop from './layers/Tpop'
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
  .map-control-scalebar-text {
    width: 83px;
  }
`
/*const LoadingContainer = styled.div`
  padding: 15px;
`*/

/**
 * DO NOT use component state / props to track mouseCoordinates
 * Reason: when state variable is updated, map is re-drawn
 * which results in a hideous flash (and unusability if not debounced)
 * So: need to use app level store state
 */

const Karte = ({
  treeName,
  dimensions,
}: {
  treeName: string,
  dimensions: Object,
}) => {
  const client = useApolloClient()
  const mobxStore = useContext(mobxStoreContext)
  const {
    activeApfloraLayers: activeApfloraLayersRaw,
    overlays,
    activeOverlays: activeOverlaysRaw,
    activeBaseLayer,
    idOfTpopBeingLocalized,
    setIdOfTpopBeingLocalized,
    bounds: boundsRaw,
    addError,
    assigningBeob,
    setMapMouseCoordinates,
    refetch,
  } = mobxStore
  const bounds = getSnapshot(boundsRaw)
  const activeApfloraLayers = getSnapshot(activeApfloraLayersRaw)
  const activeOverlays = getSnapshot(activeOverlaysRaw)

  const mapRef = useRef(null)

  const prevDimensions = usePrevious(dimensions) || {}

  useEffect(() => {
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
  }, [dimensions.width])

  const setMouseCoords = useCallback(e => {
    const [x, y] = epsg4326to2056(e.latlng.lng, e.latlng.lat)
    setMapMouseCoordinates({ x, y })
  })

  const onMouseMove = debounce(setMouseCoords, 50)

  const clustered = !(
    assigningBeob ||
    activeApfloraLayers.includes('beobZugeordnetAssignPolylines')
  )
  const OverlayComponents = useMemo(() => ({
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
  }))
  const BaseLayerComponents = useMemo(() => ({
    OsmColor: () => <OsmColor />,
    OsmBw: () => <OsmBw />,
    SwissTopoPixelFarbe: () => <SwissTopoPixelFarbe />,
    SwissTopoPixelGrau: () => <SwissTopoPixelGrau />,
    SwisstopoSiegfried: () => <SwisstopoSiegfried />,
    SwisstopoDufour: () => <SwisstopoDufour />,
    ZhUep: () => <ZhUep />,
    //BingAerial: () => <BingAerial />,
    ZhOrtho2014Rgb: () => <ZhOrtho2014Rgb />,
    ZhOrtho2014Ir: () => <ZhOrtho2014Ir />,
    ZhOrtho2015Rgb: () => <ZhOrtho2015Rgb />,
    ZhOrtho2015Ir: () => <ZhOrtho2015Ir />,
    ZhOrtho2018Rgb: () => <ZhOrtho2018Rgb />,
    ZhOrtho2018Ir: () => <ZhOrtho2018Ir />,
  }))
  const BaseLayerComponent = BaseLayerComponents[activeBaseLayer]
  const activeOverlaysSorted = sortBy(activeOverlays, activeOverlay =>
    overlays.findIndex(o => o.value === activeOverlay),
  )

  //console.log('Karte rendering')
  return (
    <Container data-id={`karten-container${treeName === 'tree' ? 1 : 2}`}>
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
                // refetch so it appears on map
                if (refetch.tpopForMap) refetch.tpopForMap()
              } catch (error) {
                addError(error)
              }
              setIdOfTpopBeingLocalized(null)
            }
          }}
        >
          {activeBaseLayer && <BaseLayerComponent />}
          {activeOverlaysSorted
            .map(overlayName => {
              const OverlayComponent = OverlayComponents[overlayName]
              return <OverlayComponent key={overlayName} />
            })
            .reverse()}
          <Pop treeName={treeName} />
          <Tpop treeName={treeName} clustered={clustered} />
          <BeobNichtBeurteilt treeName={treeName} clustered={clustered} />
          <BeobNichtZuzuordnen treeName={treeName} clustered={clustered} />
          <BeobZugeordnet treeName={treeName} clustered={clustered} />
          <BeobZugeordnetAssignPolylines treeName={treeName} />
          <ScaleControl imperial={false} />
          <LayersControl
            treeName={treeName}
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

export default observer(Karte)
