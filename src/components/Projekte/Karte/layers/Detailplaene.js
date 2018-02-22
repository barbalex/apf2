// @flow
import React from 'react'
import { GeoJSON } from 'react-leaflet'
import { inject } from 'mobx-react'

const style = () => ({ fill: false, color: 'red', weight: 1 })

const DetailplaeneLayer = ({ store }) => {
  store.map.fetchDetailplaene()
  return (
    store.map.detailplaene && (
      <GeoJSON data={store.map.detailplaene} style={style} />
    )
  )
}

export default inject('store')(DetailplaeneLayer)
