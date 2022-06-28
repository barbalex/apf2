// https://stackoverflow.com/a/25296972/712005
// also: https://gis.stackexchange.com/a/130553/13491
import React, { useEffect, useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { GeoJSON, useMap } from 'react-leaflet'
import 'leaflet'
import axios from 'redaxios'

import storeContext from '../../../../storeContext'
import popupFromProperties from './popupFromProperties'

// see: https://leafletjs.com/reference-1.6.0.html#path-option
// need to fill or else popup will only happen when line is clicked
// when fill is true, need to give stroke an opacity
const style = () => ({
  fill: true,
  fillOpacity: 0.2,
  color: 'red',
  weight: 3,
  opacity: 1,
})

const MassnahmenLayer = () => {
  const map = useMap()
  const { enqueNotification } = useContext(storeContext)

  const [data, setData] = useState(null)

  useEffect(() => {
    let isActive = true
    /**
     * BEWARE: https://maps.zh.ch does not include cors headers
     * so need to query server side
     */
    axios({
      method: 'get',
      url: 'https://ss.apflora.ch/karte/massnahmen',
    })
      .then((response) => {
        if (!isActive) return

        setData(response.data.features)
      })
      .catch((error) => {
        if (!isActive) return

        enqueNotification({
          message: `Fehler beim Laden der Massnahmen für die Karte: ${error.message}`,
          options: {
            variant: 'error',
          },
        })
        return console.log(error)
      })

    return () => {
      isActive = false
    }
  }, [enqueNotification])

  const onEachFeature = useCallback(
    (feature, layer) => {
      if (feature.properties) {
        layer.bindPopup(
          popupFromProperties({
            properties: feature.properties,
            layerName: 'Massnahmen',
            mapSize: map.getSize(),
          }),
        )
      }
    },
    [map],
  )

  if (!data) return null

  //console.log('Massnahmen, data:', data)

  return <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />
}

export default observer(MassnahmenLayer)
