import React from 'react'
import { Pane } from 'react-leaflet'

import ErrorBoundary from '../../../shared/ErrorBoundary'
/**
 * loading BingLayer results in error
 * https://github.com/TA-Geoforce/react-leaflet-bing-v2/issues/1
 */
import { BingLayer } from 'react-leaflet-bing-v2'

const bingKey =
  'AjGOtB_ygBplpxXtKiiHtm-GERjSg9TFEoCmuBI_Yz4VWy0unRGUDo9GOZHA46Pf'

const BingAerial = () => (
  <ErrorBoundary>
    <Pane className="BingAerial" name="BingAerial" style={{ zIndex: 100 }}>
      <BingLayer
        bingkey={bingKey}
        maxNativeZoom={18}
        minZoom={0}
        maxZoom={23}
      />
    </Pane>
  </ErrorBoundary>
)

export default BingAerial
