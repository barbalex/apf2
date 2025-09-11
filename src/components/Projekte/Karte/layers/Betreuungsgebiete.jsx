// https://stackoverflow.com/a/25296972/712005
// also: https://gis.stackexchange.com/a/130553/13491
import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { GeoJSON } from 'react-leaflet'
import { gql } from '@apollo/client';

import { useQuery } from "@apollo/client/react";

import { MobxContext } from '../../../../mobxContext.js'

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

export const Betreuungsgebiete = memo(
  observer(() => {
    const { enqueNotification } = useContext(MobxContext)

    const { data, error } = useQuery(gql`
      query nsBetreuungsQuery {
        allNsBetreuungs {
          nodes {
            id: gebietNr
            geom {
              geojson
            }
          }
        }
      }
    `)

    if (error) {
      enqueNotification({
        message: `Fehler beim Laden der NS-Gebiets-Betreuer: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }

    if (!data) return null

    const nodes = data?.allNsBetreuungs?.nodes ?? []
    const betrGebiete = nodes.map((n) => ({
      type: 'Feature',
      properties: {},
      geometry: JSON.parse(n?.geom?.geojson),
    }))

    return (
      <GeoJSON
        data={betrGebiete}
        style={style}
        interactive={false}
      />
    )
  }),
)
