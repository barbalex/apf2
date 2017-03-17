// @flow
/*
 *
 * Karte
 * swisstopo wmts: https://wmts10.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml
 *
 */

import React, { Component, PropTypes } from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Map, ScaleControl } from 'react-leaflet'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'

import LayersControl from './LayersControl'
import OsmColorLayer from './layers/OsmColor'
import OsmBwLayer from './layers/OsmBw'
import SwissTopoPixelFarbeLayer from './layers/SwisstopoPixelFarbe'
import SwissTopoPixelGrauLayer from './layers/SwisstopoPixelGrau'
import BingAerialLayer from './layers/BingAerial'
import ZhOrtho from './layers/ZhOrtho'
import ZhOrthoIr from './layers/ZhOrthoIr'
import ZhOrtho2015 from './layers/ZhOrtho2015'
import ZhOrtho2015Ir from './layers/ZhOrtho2015Ir'
import ZhUep from './layers/ZhUep'
import DetailplaeneLayer from './layers/Detailplaene'
import ZhSvoColorLayer from './layers/ZhSvoColor'
import ZhSvoGreyLayer from './layers/ZhSvoGrey'
import ZhLrVegKartierungen from './layers/ZhLrVegKartierungen'
import ZhLichteWaelder from './layers/ZhLichteWaelder'
import ZhGemeindegrenzen from './layers/ZhGemeindegrenzen'
import ZhWaelderVegetation from './layers/ZhWaelderVegetation'
import ZhUepOverlay from './layers/ZhUepOverlay'
import '../../../../node_modules/leaflet/dist/leaflet.css'
import '../../../../node_modules/leaflet-measure/dist/leaflet-measure.css'
import '../../../../node_modules/leaflet.markercluster/dist/MarkerCluster.css'
import PopMarkerCluster from './layers/PopMarkerCluster'
import TpopMarkerCluster from './layers/TpopMarkerCluster'
import BeobMarkerCluster from './layers/BeobMarkerCluster'
import MeasureControl from './MeasureControl'
import PrintControl from './PrintControl'
import PngControl from './PngControl'
import CoordinatesControl from './CoordinatesControl'
import epsg4326to21781 from '../../../modules/epsg4326to21781'

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
const ktZhBounds = [[47.159, 8.354], [47.696, 8.984]]

const enhance = compose(
  inject(`store`),
  // make bounds state, need to manage them manually
  withState(`bounds`, `changeBounds`, ktZhBounds),
  observer
)

class Karte extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    popMarkers: PropTypes.object,
    tpopMarkers: PropTypes.object,
    beobNichtBeurteiltMarkers: PropTypes.object,
    beobNichtZuzuordnenMarkers: PropTypes.object,
    tpopBeobMarkers: PropTypes.object,
    idOfTpopBeingLocalized: PropTypes.number.isRequired,
    changeBounds: PropTypes.func.isRequired,
    bounds: PropTypes.array,
  }

  componentDidMount() {
    const { store, changeBounds } = this.props
    changeBounds(store.map.bounds)
  }

  componentDidUpdate(prevProps, prevState) {
    const { store, changeBounds, idOfTpopBeingLocalized } = this.props
    /**
     * when tpops are localized, need to zoom to tpop if it has coordinates
     */
    if (idOfTpopBeingLocalized && prevProps.idOfTpopBeingLocalized !== idOfTpopBeingLocalized) {
      changeBounds(store.map.tpop.bounds)
    }
  }

  render() {
    const {
      store,
      popMarkers,
      tpopMarkers,
      beobNichtBeurteiltMarkers,
      beobNichtZuzuordnenMarkers,
      tpopBeobMarkers,
      bounds,
      changeBounds,
      idOfTpopBeingLocalized,
    } = this.props
    const { activeBaseLayer, activeOverlays } = store.map
    const MapElement = !!idOfTpopBeingLocalized ? StyledMapLocalizing : StyledMap
    // this does not work
    // see issue on proj4js: https://github.com/proj4js/proj4js/issues/214
    /*
    const crs = new window.L.Proj.CRS(
      `EPSG:21781`,
      `+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs`,
      {
        resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
        bounds,
      }
    )*/
    const showOsmColorLayer = activeBaseLayer === `OsmColor`
    const showOsmBwLayer = activeBaseLayer === `OsmBw`
    const showSwissTopoPixelFarbeLayer = activeBaseLayer === `SwissTopoPixelFarbe`
    const showSwissTopoPixelGrauLayer = activeBaseLayer === `SwissTopoPixelGrau`
    const showZhUep = activeBaseLayer === `ZhUep`
    const showBingAerialLayer = activeBaseLayer === `BingAerial`
    const showZhOrtho = activeBaseLayer === `ZhOrtho`
    const showZhOrthoIr = activeBaseLayer === `ZhOrthoIr`
    const showZhOrtho2015 = activeBaseLayer === `ZhOrtho2015`
    const showZhOrtho2015Ir = activeBaseLayer === `ZhOrtho2015Ir`
    const showZhUepOverlay = activeOverlays.includes(`ZhUep`)
    const showDetailplaene = activeOverlays.includes(`Detailplaene`)
    const showZhGemeindegrenzen = activeOverlays.includes(`ZhGemeindegrenzen`)
    const showZhSvoColor = activeOverlays.includes(`ZhSvoColor`)
    const showZhSvoGrey = activeOverlays.includes(`ZhSvoGrey`)
    const showZhLrVegKartierungen = activeOverlays.includes(`ZhLrVegKartierungen`)
    const showZhLichteWaelder = activeOverlays.includes(`ZhLichteWaelder`)
    const showZhWaelderVegetation = activeOverlays.includes(`ZhWaelderVegetation`)

    const showTpopBeob = activeOverlays.includes(`tpopBeob`)
    const showBeobNichtBeurteilt = activeOverlays.includes(`beobNichtBeurteilt`)
    const showBeobNichtZuzuordnen = activeOverlays.includes(`beobNichtZuzuordnen`)

    return (
      <MapElement
        bounds={bounds}
        preferCanvas
        onMouseMove={store.setMapMouseCoord}
        // need max and min zoom because otherwise
        // something errors
        // probably clustering function
        maxZoom={50}
        minZoom={1}
        pop={store.map.pop.pops}
        onClick={(event) => {
          if (!!idOfTpopBeingLocalized) {
            const {lat, lng} = event.latlng
            const [x, y] = epsg4326to21781(lng, lat)
            store.localizeTpop(x, y)
          }
        }}
        onZoomlevelschange={(event) => {
          // need to update bounds, otherwise map jumps back
          // when adding new tpop
          const bounds = event.target.getBounds()
          changeBounds([bounds._southWest, bounds._northEast])
        }}
        onZoomend={(event) => {
          // need to update bounds, otherwise map jumps back
          const bounds = event.target.getBounds()
          changeBounds([bounds._southWest, bounds._northEast])
        }}
        onMoveend={(event) => {
          // need to update bounds, otherwise map jumps back
          const bounds = event.target.getBounds()
          changeBounds([bounds._southWest, bounds._northEast])
        }}
      >
        {
          showOsmColorLayer &&
          <OsmColorLayer />
        }
        {
          showOsmBwLayer &&
          <OsmBwLayer />
        }
        {
          showSwissTopoPixelFarbeLayer &&
          <SwissTopoPixelFarbeLayer />
        }
        {
          showSwissTopoPixelGrauLayer &&
          <SwissTopoPixelGrauLayer />
        }
        {
          showZhUep &&
          <ZhUep />
        }
        {
          showBingAerialLayer &&
          <BingAerialLayer />
        }
        {
          showZhOrtho &&
          <ZhOrtho />
        }
        {
          showZhOrthoIr &&
          <ZhOrthoIr />
        }
        {
          showZhOrtho2015 &&
          <ZhOrtho2015 />
        }
        {
          showZhOrtho2015Ir &&
          <ZhOrtho2015Ir />
        }
        {
          showZhUepOverlay &&
          <ZhUepOverlay />
        }
        {
          showDetailplaene &&
          <DetailplaeneLayer />
        }
        {
          showZhGemeindegrenzen &&
          <ZhGemeindegrenzen />
        }
        {
          showZhSvoColor &&
          <ZhSvoColorLayer />
        }
        {
          showZhSvoGrey &&
          <ZhSvoGreyLayer />
        }
        {
          showZhLrVegKartierungen &&
          <ZhLrVegKartierungen />
        }
        {
          showZhLichteWaelder &&
          <ZhLichteWaelder />
        }
        {
          showZhWaelderVegetation &&
          <ZhWaelderVegetation />
        }
        <PopMarkerCluster
          highlightedIds={toJS(store.map.pop.highlightedIds)}
          labelUsingNr={store.map.pop.labelUsingNr}
          pops={store.map.pop.pops}
          visible={store.map.activeOverlays.includes(`pop`)}
          markers={popMarkers}
        />
        <TpopMarkerCluster
          highlightedIds={toJS(store.map.tpop.highlightedIds)}
          labelUsingNr={store.map.tpop.labelUsingNr}
          tpops={store.map.tpop.tpops}
          visible={store.map.activeOverlays.includes(`tpop`)}
          markers={tpopMarkers}
        />
        <BeobMarkerCluster
          highlightedIds={toJS(store.map.beobNichtBeurteilt.highlightedIds)}
          beobs={store.map.beobNichtBeurteilt.beobs}
          visible={store.map.activeOverlays.includes(`beobNichtBeurteilt`)}
          markers={beobNichtBeurteiltMarkers}
        />
        <BeobMarkerCluster
          highlightedIds={toJS(store.map.beobNichtZuzuordnen.highlightedIds)}
          beobs={store.map.beobNichtZuzuordnen.beobs}
          visible={store.map.activeOverlays.includes(`beobNichtZuzuordnen`)}
          markers={beobNichtZuzuordnenMarkers}
        />
        <BeobMarkerCluster
          highlightedIds={toJS(store.map.tpopBeob.highlightedIds)}
          beobs={store.map.tpopBeob.beobs}
          visible={store.map.activeOverlays.includes(`tpopBeob`)}
          markers={tpopBeobMarkers}
        />
        <ScaleControl imperial={false} />
        <LayersControl />
        <MeasureControl />
        <PrintControl />
        <PngControl />
        <CoordinatesControl />
      </MapElement>
    )
  }
}

export default enhance(Karte)
