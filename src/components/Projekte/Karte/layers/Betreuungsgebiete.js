// https://stackoverflow.com/a/25296972/712005
// also: https://gis.stackexchange.com/a/130553/13491
import React, { useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'
//import { useLeaflet } from 'react-leaflet'
import 'leaflet'
import axios from 'axios'

import storeContext from '../../../../storeContext'

const BetreuungsgebieteLayer = () => {
  const { enqueNotification } = useContext(storeContext)
  //const { map } = useLeaflet()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const baseUrl = 'https://maps.zh.ch/wfs/OGDZHWFS'
    const params = {
      service: 'WFS',
      version: '2.0.0',
      request: 'getFeature',
      typeName: 'ms:ogd-0428_aln_fns_betreuungsgebiete_f',
      maxFeatures: 3000,
      outputFormat: 'application/json',
    }
    const url = `${baseUrl}${window.L.Util.getParamString(params)}`
    console.log('Betreuungsgebiete, url:', url)
    axios({
      method: 'get',
      url,
      auth: {
        username: process.env.GATSBY_MAPS_ZH_CH_USER,
        password: process.env.GATSBY_MAPS_ZH_CH_SECRET,
      },
    })
      .then((response) => {
        console.log('Betreuungsgebiete, response:', response)
        //const layer = new window.L.GeoJSON()
      })
      .catch((error) => {
        enqueNotification({
          message: `Fehler beim Laden der Betreuungsgebiete für die Karte: ${error.message}`,
          options: {
            variant: 'error',
          },
        })
        return console.log(error)
      })
  }, [enqueNotification])

  return <div style={{ display: 'none' }} />
}

export default observer(BetreuungsgebieteLayer)
