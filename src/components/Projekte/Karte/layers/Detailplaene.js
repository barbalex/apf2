// @flow
import React from 'react'
import { GeoJSON } from 'react-leaflet'
import { inject } from 'mobx-react'

const DetailplaeneLayer = ({ store }) => {
  store.map.fetchDetailplaene()
  return <GeoJSON data={store.map.detailplaene} />
}

export default inject('store')(DetailplaeneLayer)
