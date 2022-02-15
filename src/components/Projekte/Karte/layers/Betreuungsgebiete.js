// https://stackoverflow.com/a/25296972/712005
// also: https://gis.stackexchange.com/a/130553/13491
import React, { useEffect, useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { GeoJSON } from 'react-leaflet'
import 'leaflet'
import axios from 'redaxios'
import { useQuery, gql } from '@apollo/client'

import storeContext from '../../../../storeContext'
import popupFromProperties from './popupFromProperties'
import { nsBetreuung } from '../../../shared/fragments'

const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}

// see: https://leafletjs.com/reference-1.6.0.html#path-option
// need to fill or else popup will only happen when line is clicked
// when fill is true, need to give stroke an opacity
const style = () => ({
  fill: true,
  fillOpacity: 0,
  color: 'green',
  weight: 3,
  opacity: 1,
})

const BetreuungsgebieteLayer = () => {
  const { enqueNotification } = useContext(storeContext)

  const [gbData, setGbData] = useState(null)
  const [totalData, setTotalData] = useState(null)

  const { data: nsbData, error: nsbError } = useQuery(gql`
    query nsBetreuungsQuery {
      allNsBetreuungs {
        nodes {
          ...NsBetreuungFields
        }
      }
    }
    ${nsBetreuung}
  `)

  if (nsbError) {
    enqueNotification({
      message: `Fehler beim Laden der NS-Gebiets-Betreuer: ${nsbError.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  useEffect(() => {
    let isActive = true
    /**
     * BEWARE: https://maps.zh.ch does not include cors headers
     * so need to query server side
     */
    axios({
      method: 'get',
      url: 'https://ss.apflora.ch/karte/betreuungsgebiete',
    })
      .then((response) => {
        if (!isActive) return

        setGbData(response.data.features)
      })
      .catch((error) => {
        if (!isActive) return

        enqueNotification({
          message: `Fehler beim Laden der Betreuungsgebiete für die Karte: ${error.message}`,
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

  useEffect(() => {
    if (gbData && nsbData) {
      const nsbNodes = nsbData?.allNsBetreuungs?.nodes ?? []
      const totalData = gbData.map((d) => {
        const nsb = nsbNodes.find((n) => n.gebietNr === d.properties.nr) || {}
        const properties = {
          ...d.properties,
          firma: nsb.firma || '',
          projektleiter: nsb.projektleiter || '',
          telefon: nsb.telefon || '',
        }
        delete properties.geodb_oid

        return {
          geometry: d.geometry,
          type: d.type,
          properties,
        }
      })
      setTotalData(totalData)
    }
  }, [gbData, nsbData])

  if (!totalData) return null

  return (
    <GeoJSON data={totalData} style={style} onEachFeature={onEachFeature} />
  )
}

export default observer(BetreuungsgebieteLayer)
