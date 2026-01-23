// swisstopo wmts: https://wmts10.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml
import { useState, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { MapContainer, ScaleControl, ZoomControl, Pane } from 'react-leaflet'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'
import { sortBy } from 'es-toolkit'
import { useParams } from 'react-router'

import { MapResizer } from './MapResizer.tsx'
import { Control } from './Control.tsx'
import { OsmColor } from './layers/OsmColor.tsx'
import { OsmBw } from './layers/OsmBw.tsx'
import { SwisstopoPixelFarbe } from './layers/SwisstopoPixelFarbe.tsx'
import { SwisstopoPixelGrau } from './layers/SwisstopoPixelGrau.tsx'
import { SwisstopoSiegfried } from './layers/SwisstopoSiegfried.tsx'
import { SwisstopoLuftbilderFarbe } from './layers/SwisstopoLuftbilderFarbe.tsx'
import { SwisstopoDufour } from './layers/SwisstopoDufour.tsx'
import { ZhOrtho2014Rgb } from './layers/ZhOrtho2014Rgb.tsx'
import { ZhOrtho2014Ir } from './layers/ZhOrtho2014Ir.tsx'
import { ZhOrtho2015Rgb } from './layers/ZhOrtho2015Rgb.tsx'
import { ZhOrtho2018Rgb } from './layers/ZhOrtho2018Rgb.tsx'
import { ZhOrthoAktuellRgb } from './layers/ZhOrthoAktuellRgb.tsx'
import { ZhOrthoAktuellIr } from './layers/ZhOrthoAktuellIr.tsx'
import { ZhOrtho2018Ir } from './layers/ZhOrtho2018Ir.tsx'
import { ZhOrtho2015Ir } from './layers/ZhOrtho2015Ir.tsx'
import { ZhUep } from './layers/ZhUep.tsx'
import { Detailplaene } from './layers/Detailplaene.tsx'
import { Massnahmen } from './layers/Massnahmen.tsx'
import { Betreuungsgebiete } from './layers/Betreuungsgebiete.tsx'
import { Forstreviere } from './layers/Forstreviere.tsx'
import { Markierungen } from './layers/Markierungen.tsx'
import { ZhSvoColor } from './layers/ZhSvoColor.tsx'
import { ZhPflegeplan } from './layers/ZhPflegeplan.tsx'
import { ZhSvoGrey } from './layers/ZhSvoGrey.tsx'
import { ZhLrVegKartierungen } from './layers/ZhLrVegKartierungen.tsx'
import { ZhLichteWaelder } from './layers/ZhLichteWaelder.tsx'
import { Gemeinden } from './layers/Gemeinden.tsx'
import { ZhWaelderVegetation } from './layers/ZhWaelderVegetation.tsx'
import { ZhForstreviereWms } from './layers/ZhForstreviereWms.tsx'
import { ZhUepOverlay } from './layers/ZhUepOverlay.tsx'
import { Pop } from './layers/Pop/index.tsx'
import { Tpop } from './layers/Tpop/index.tsx'
import { BeobNichtBeurteilt } from './layers/BeobNichtBeurteilt/index.tsx'
import { BeobNichtZuzuordnen } from './layers/BeobNichtZuzuordnen/index.tsx'
import { BeobZugeordnet } from './layers/BeobZugeordnet/index.tsx'
import { BeobZugeordnetAssignPolylines } from './layers/BeobZugeordnetAssignPolylines/index.tsx'
import { MeasureControl } from './MeasureControl.tsx'
import { DrawControl } from './DrawControl.tsx'
import { PrintControl } from './PrintControl.tsx'
import { OwnControls } from './OwnControls.tsx'
import { CoordinatesControl } from './CoordinatesControl/index.tsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'
import { MapFilterListener } from './MapFilterListener.tsx'
import { ClickListener } from './ClickListener.tsx'

import 'leaflet/dist/leaflet.css'
import 'leaflet-measure/dist/leaflet-measure.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'

import {
  assigningBeobAtom,
  mapHideControlsAtom,
  mapBoundsAtom,
  mapActiveApfloraLayersAtom,
  mapShowApfLayersForMultipleApsAtom,
  mapOverlaysAtom,
  mapActiveOverlaysAtom,
  mapActiveBaseLayerAtom,
  treeMapFilterAtom,
} from '../../../store/index.ts'

import styles from './index.module.css'

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

/**
 * DO NOT use component state / props to track mouseCoordinates
 * Reason: when state variable is updated, map is re-drawn
 * which results in a hideous flash (and un-usability if not debounced)
 * So: need to use app level store state
 */

const OverlayComponents = {
  ZhUep: () => <ZhUepOverlay />,
  // rebuild detailplaene on localizing change to close popups and rebuild without popups
  Detailplaene: () => <Detailplaene />,
  Markierungen: () => <Markierungen />,
  MassnahmenFlaechen: () => <Massnahmen layer="flaechen" />,
  MassnahmenLinien: () => <Massnahmen layer="linien" />,
  MassnahmenPunkte: () => <Massnahmen layer="punkte" />,
  Betreuungsgebiete: () => <Betreuungsgebiete />,
  Forstreviere: () => <Forstreviere />,
  Gemeinden: () => <Gemeinden />,
  ZhSvoColor: () => <ZhSvoColor />,
  ZhSvoGrey: () => <ZhSvoGrey />,
  ZhPflegeplan: () => <ZhPflegeplan />,
  ZhLrVegKartierungen: () => <ZhLrVegKartierungen />,
  ZhLichteWaelder: () => <ZhLichteWaelder />,
  ZhWaelderVegetation: () => <ZhWaelderVegetation />,
  ZhForstreviereWms: () => <ZhForstreviereWms />,
}

const BaseLayerComponents = {
  OsmColor: () => <OsmColor />,
  OsmBw: () => <OsmBw />,
  SwisstopoPixelFarbe: () => <SwisstopoPixelFarbe />,
  SwisstopoPixelGrau: () => <SwisstopoPixelGrau />,
  SwisstopoLuftbilderFarbe: () => <SwisstopoLuftbilderFarbe />,
  SwisstopoSiegfried: () => <SwisstopoSiegfried />,
  SwisstopoDufour: () => <SwisstopoDufour />,
  ZhUep: () => <ZhUep />,
  ZhOrthoAktuellRgb: () => <ZhOrthoAktuellRgb />,
  ZhOrthoAktuellIr: () => <ZhOrthoAktuellIr />,
  ZhOrtho2018Rgb: () => <ZhOrtho2018Rgb />,
  ZhOrtho2018Ir: () => <ZhOrtho2018Ir />,
  ZhOrtho2015Rgb: () => <ZhOrtho2015Rgb />,
  ZhOrtho2015Ir: () => <ZhOrtho2015Ir />,
  ZhOrtho2014Rgb: () => <ZhOrtho2014Rgb />,
  ZhOrtho2014Ir: () => <ZhOrtho2014Ir />,
}

export const Karte = ({ mapContainerRef }) => {
  const { apId } = useParams()

  const mapRef = useRef(null)

  const assigningBeob = useAtomValue(assigningBeobAtom)
  const hideMapControls = useAtomValue(mapHideControlsAtom)
  const bounds = useAtomValue(mapBoundsAtom)
  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const showApfLayersForMultipleAps = useAtomValue(
    mapShowApfLayersForMultipleApsAtom,
  )
  const overlays = useAtomValue(mapOverlaysAtom)
  const activeOverlays = useAtomValue(mapActiveOverlaysAtom)
  const activeBaseLayer = useAtomValue(mapActiveBaseLayerAtom)
  const mapFilter = useAtomValue(treeMapFilterAtom)

  const showApfLayers = showApfLayersForMultipleAps || !!apId
  const showPop = activeApfloraLayers.includes('pop') && showApfLayers
  const showTpop = activeApfloraLayers.includes('tpop') && showApfLayers
  const showBeobNichtBeurteilt =
    activeApfloraLayers.includes('beobNichtBeurteilt') && showApfLayers
  const showBeobNichtZuzuordnen =
    activeApfloraLayers.includes('beobNichtZuzuordnen') && showApfLayers
  const showBeobZugeordnet =
    activeApfloraLayers.includes('beobZugeordnet') && showApfLayers
  const showBeobZugeordnetAssignPolylines =
    activeApfloraLayers.includes('beobZugeordnetAssignPolylines') &&
    showApfLayers

  /**
   * need to pass the height of the self built controls
   * to move controls built by leaflet when layer menu changes height
   * Beware: If initial value is wrong, map will render twice
   */
  const [controlHeight, setControlHeight] = useState(167)

  const clustered = !(
    assigningBeob ||
    activeApfloraLayers.includes('beobZugeordnetAssignPolylines')
  )

  const BaseLayerComponent = BaseLayerComponents[activeBaseLayer]
  const activeOverlaysSorted = sortBy(activeOverlays, [
    (activeOverlay) => overlays.findIndex((o) => o.value === activeOverlay),
  ])

  // explicitly sort Layers
  // Use Pane with z-index: https://github.com/PaulLeCam/react-leaflet/issues/271#issuecomment-609752044
  // Idea:
  // 1. create pane for each layer, give it className of layer name
  // 2. give base layer pane z-index: 100
  // 3. give overlays 100 + index in activeOverlaysSorted
  // 4. apflora layers always on top

  // console.log('Map', {
  //   activeBaseLayer,
  //   activeOverlaysSorted,
  //   activeApfloraLayers,
  //   bounds,
  //   mapContainerRef,
  // })
  // console.log('Map, bounds:', bounds)

  // clustered layers receive a key that rebuilds them every time the cluster
  // tool would erroneously add new markers from last time it build
  // see: https://github.com/barbalex/apf2/issues/467

  return (
    <div
      className={`outer-map-container ${styles.container}`}
      data-id="karten-container1"
      ref={mapRef}
    >
      <ErrorBoundary>
        <MapContainer
          // bounds need to be set using map.fitBounds sice v3
          // but keep bounds in store as last bound will be reapplied
          // when map is re-opened
          bounds={bounds}
          // need max and min zoom because otherwise
          // something errors
          // probably clustering function
          maxZoom={23}
          minZoom={0}
          doubleClickZoom={false}
          zoomControl={false}
          className={`map-container ${styles.mapContainer}`}
        >
          {activeBaseLayer && (
            <MapResizer mapContainerRef={mapContainerRef}>
              <BaseLayerComponent />
            </MapResizer>
          )}
          {/* TODO: Set paneBaseIndex to 400 (?), subtract index from zIndex in Pane style, then remove reverse() */}
          {activeOverlaysSorted
            .reverse()
            .map((overlayName, index) => {
              const OverlayComponent = OverlayComponents[overlayName]
              // prevent bad error if wrong overlayName was passed
              // for instance after an overlay was renamed but user still has old name in cache
              if (!OverlayComponent) return null

              return (
                <Pane
                  key={`${overlayName}/${index}`}
                  className={overlayName}
                  name={overlayName}
                  style={{ zIndex: 200 + index }}
                >
                  <OverlayComponent />
                </Pane>
              )
            })
            .reverse()}
          {showPop && (
            // add no pane
            // it prevented pop svgs from appearing
            // leaflet sets z-index to 600 anyway
            <Pop
              key={`${apId ?? ''}/pop/${activeApfloraLayers.join()}/${
                mapFilter?.coordinates ?? 99
              }`}
            />
          )}
          {showTpop && (
            <Tpop
              key={`${apId}/tpop/${activeApfloraLayers.join()}/${
                mapFilter?.coordinates ?? 99
              }`}
              clustered={clustered}
            />
          )}
          {showBeobNichtBeurteilt && (
            <BeobNichtBeurteilt
              key={`${apId}/beobNichtBeurteilt/${activeApfloraLayers.join()}/${
                mapFilter?.coordinates ?? 99
              }`}
              clustered={clustered}
            />
          )}
          {showBeobNichtZuzuordnen && (
            <BeobNichtZuzuordnen
              key={`${apId}/beobNichtZuzuordnen/${activeApfloraLayers.join()}/${
                mapFilter?.coordinates ?? 99
              }`}
              clustered={clustered}
            />
          )}
          {showBeobZugeordnet && (
            <BeobZugeordnet
              key={`${apId}/beobZugeordnet/${activeApfloraLayers.join()}/${
                mapFilter?.coordinates ?? 99
              }`}
              clustered={clustered}
            />
          )}
          {showBeobZugeordnetAssignPolylines && (
            <BeobZugeordnetAssignPolylines />
          )}
          <ClickListener />
          <ScaleControl imperial={false} />
          <Control
            position="topright"
            visible={!hideMapControls}
          >
            <OwnControls
              // this enforces rerendering when sorting changes
              activeOverlaysString={activeOverlays.join()}
              activeApfloraLayersString={activeApfloraLayers.join()}
              mapRef={mapRef}
            />
          </Control>
          <PrintControl />
          <ZoomControl position="topright" />
          <MeasureControl />
          <DrawControl />
          <Control position="bottomright">
            <CoordinatesControl />
          </Control>
          <MapFilterListener />
        </MapContainer>
      </ErrorBoundary>
    </div>
  )
}
