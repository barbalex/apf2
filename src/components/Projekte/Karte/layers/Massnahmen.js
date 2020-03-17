// https://stackoverflow.com/a/25296972/712005
// also: https://gis.stackexchange.com/a/130553/13491
import React, { useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'
//import { useLeaflet } from 'react-leaflet'
import 'leaflet'
import axios from 'axios'

import storeContext from '../../../../storeContext'

const MassnahmenLayer = () => {
  const { enqueNotification } = useContext(storeContext)
  //const { map } = useLeaflet()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const baseUrl = 'http://maps.zh.ch/wfs/FnsAPFloraWFS'
    const params = {
      service: 'WFS',
      version: '1.0.0',
      request: 'getFeature',
      typeName: 'ms:massnahmenflaechen',
      maxFeatures: 3000,
      outputFormat: 'application/json',
    }
    const url = `${baseUrl}${window.L.Util.getParamString(params)}`
    console.log('Massnahmen, url:', url)
    let response
    try {
      response = axios({
        method: 'get',
        url,
        auth: {
          username: process.env.GATSBY_MAPS_ZH_CH_USER,
          password: process.env.GATSBY_MAPS_ZH_CH_SECRET,
        },
      })
    } catch (error) {
      enqueNotification({
        message: `Fehler beim Laden der Massnahmen für die Karte: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
      return console.log(error)
    }
    console.log('Massnahmen, response:', response)
    //const layer = new window.L.GeoJSON()
  }, [enqueNotification])

  return <div style={{ display: 'none' }} />
}

export default observer(MassnahmenLayer)
