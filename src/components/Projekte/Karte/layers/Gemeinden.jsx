import { memo, useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import { gql } from '@apollo/client';
import { useQuery } from "@apollo/client/react";
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'

// see: https://leafletjs.com/reference-1.6.0.html#path-option
// need to fill or else popup will only happen when line is clicked
// when fill is true, need to give stroke an opacity
const style = () => ({
  fill: true,
  fillOpacity: 0,
  color: 'orange',
  weight: 3,
  opacity: 1,
})

export const Gemeinden = memo(
  observer(() => {
    const { enqueNotification } = useContext(MobxContext)

    const { data, error } = useQuery(gql`
      query karteGemeindesQuery {
        allChAdministrativeUnits(
          filter: { localisedcharacterstring: { equalTo: "Gemeinde" } }
        ) {
          nodes {
            id
            geom {
              geojson
            }
          }
        }
      }
    `)

    if (error) {
      enqueNotification({
        message: `Fehler beim Laden der Gemeinden für die Karte: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }

    if (!data) return null

    const nodes = data?.allChAdministrativeUnits?.nodes ?? []
    const gemeinden = nodes.map((n) => ({
      type: 'Feature',
      properties: { Gemeinde: n.text ?? '' },
      geometry: JSON.parse(n?.geom?.geojson),
    }))

    return (
      <GeoJSON
        data={gemeinden}
        style={style}
        interactive={false}
      />
    )
  }),
)
