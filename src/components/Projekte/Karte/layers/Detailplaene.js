// @flow
import React from 'react'
import { GeoJSON } from 'react-leaflet'
import { inject } from 'mobx-react'
import { toJS } from 'mobx'

const style = () => ({ fill: false, color: 'red', weight: 1 })

const DetailplaeneLayer = ({ store }) => {
  store.map.fetchDetailplaene()
  const data = toJS(store.map.detailplaene)

  return data && <GeoJSON data={data} style={style} />
}

export default inject('store')(DetailplaeneLayer)
