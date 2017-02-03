// @flow
import React from 'react'
import { GeoJSON } from 'react-leaflet'

import detailplaene from '../../../../etc/detailplaeneWgs84.json'

const DetailplaeneLayer = () =>
  <GeoJSON
    data={detailplaene}
  />
  
export default DetailplaeneLayer
