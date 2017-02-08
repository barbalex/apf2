// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { LayersControl } from 'react-leaflet'
import compose from 'recompose/compose'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'

import OsmColorLayer from './layers/OsmColor'
import OsmBwLayer from './layers/OsmBw'
import SwissTopoPixelFarbeLayer from './layers/SwisstopoPixelFarbe'
import SwissTopoPixelGrauLayer from './layers/SwisstopoPixelGrau'
import BingAerialLayer from './layers/BingAerial'
import DetailplaeneLayer from './layers/Detailplaene'
import ZhSvoColorLayer from './layers/ZhSvoColor'
import ZhSvoGreyLayer from './layers/ZhSvoGrey'
import ZhLrVegKartierungen from './layers/ZhLrVegKartierungen'
import ZhLichteWaelder from './layers/ZhLichteWaelder'
import ZhGemeindegrenzen from './layers/ZhGemeindegrenzen'
import ZhWaelderVegetation from './layers/ZhWaelderVegetation'
import ZhOrtho from './layers/ZhOrtho'
import ZhOrthoIr from './layers/ZhOrthoIr'
import ZhOrtho2015 from './layers/ZhOrtho2015'
import ZhOrtho2015Ir from './layers/ZhOrtho2015Ir'
import ZhUep from './layers/ZhUep'
import ZhUepOverlay from './layers/ZhUepOverlay'

const { BaseLayer, Overlay } = LayersControl

const enhance = compose(
  inject(`store`),
  observer
)

const MyLayersControl = ({ store }) =>
  <LayersControl>
    <BaseLayer checked name="OpenStreetMap farbig">
      <OsmColorLayer />
    </BaseLayer>
    <BaseLayer name="OpenStreetMap grau">
      <OsmBwLayer />
    </BaseLayer>
    <BaseLayer name="Swisstopo Karte">
      <SwissTopoPixelFarbeLayer />
    </BaseLayer>
    <BaseLayer name="Swisstopo Karte grau">
      <SwissTopoPixelGrauLayer />
    </BaseLayer>
    <BaseLayer name="ZH Übersichtsplan">
      <ZhUep />
    </BaseLayer>
    <BaseLayer name="Bing Luftbild">
      <BingAerialLayer />
    </BaseLayer>
    <BaseLayer name="ZH Orthofoto Sommer RGB">
      <ZhOrtho />
    </BaseLayer>
    <BaseLayer name="ZH Orthofoto Sommer Falschfarbeninfrarot">
      <ZhOrthoIr />
    </BaseLayer>
    <BaseLayer name="ZH Orthofoto Frühjahr 2015/16 RGB">
      <ZhOrtho2015 />
    </BaseLayer>
    <BaseLayer name="ZH Orthofoto Frühjahr 2015/16 Falschfarbeninfrarot">
      <ZhOrtho2015Ir />
    </BaseLayer>
    <Overlay name="ZH Übersichtsplan zum darüberlegen">
      <ZhUepOverlay />
    </Overlay>
    <Overlay name="Detailplaene">
      <DetailplaeneLayer />
    </Overlay>
    <Overlay name="ZH Gemeindegrenzen">
      <ZhGemeindegrenzen />
    </Overlay>
    <Overlay name="SVO farbig">
      <ZhSvoColorLayer />
    </Overlay>
    <Overlay name="SVO grau">
      <ZhSvoGreyLayer />
    </Overlay>
    <Overlay name="Lebensraum- und Vegetationskartierungen">
      <ZhLrVegKartierungen />
    </Overlay>
    <Overlay name="Wälder: lichte">
      <ZhLichteWaelder />
    </Overlay>
    <Overlay name="Wälder: Vegetation">
      <ZhWaelderVegetation />
    </Overlay>
  </LayersControl>

export default enhance(MyLayersControl)
