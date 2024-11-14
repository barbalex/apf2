import { memo, useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import { observer } from 'mobx-react-lite'
import { useQuery, gql } from '@apollo/client'

import { StoreContext } from '../../../../storeContext.js'

// see: https://leafletjs.com/reference-1.6.0.html#path-option
// need to fill or else popup will only happen when line is clicked
// when fill is true, need to give stroke an opacity
const style = () => ({
  fill: true,
  fillOpacity: 0,
  color: 'red',
  weight: 1,
  opacity: 1,
})

export const Detailplaene = memo(
  observer(() => {
    const { enqueNotification } = useContext(StoreContext)

    const { data, error } = useQuery(gql`
      query karteDetailplaenesQuery {
        allDetailplaenes {
          nodes {
            id
            data
            geom {
              geojson
            }
          }
        }
      }
    `)

    if (error) {
      enqueNotification({
        message: `Fehler beim Laden der Detailpläne: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }

    if (!data) return null

    const nodes = data?.allDetailplaenes?.nodes ?? []
    const detailplaene = nodes.map((n) => ({
      type: 'Feature',
      properties: n.data ? JSON.parse(n.data) : null,
      geometry: JSON.parse(n?.geom?.geojson),
    }))

    return (
      <GeoJSON
        data={detailplaene}
        style={style}
        interactive={false}
      />
    )
  }),
)
