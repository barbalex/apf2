import { GeoJSON } from 'react-leaflet'
import { useQuery } from '@tanstack/react-query'
import type { Feature, FeatureCollection } from 'geojson'
import { apiFetch } from '../../../../modules/api.ts'

interface GemeindeNode {
  id: string
  // exists on the GraphQL type but is not queried here;
  // the access keeps the popup property in place (undefined -> '')
  text?: string
  geom: {
    geojson: string
  } | null
}

interface GemeindenQueryResult {
  allChAdministrativeUnits: {
    nodes: GemeindeNode[]
  }
}

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

export const Gemeinden = () => {
  const { data } = useQuery({
    queryKey: ['gemeinden'],
    queryFn: async () => {
      // phase 5: the former geometry embed arrives as raw GeoJSON
      const nodes =
        (await apiFetch<{ id: string; geom: unknown }[]>(
          `/ch_administrative_unit?localisedcharacterstring=eq.Gemeinde&select=id,geom`,
        )) ?? []
      return {
        allChAdministrativeUnits: {
          nodes: nodes.map((n) => ({
            id: n.id,
            geom: { geojson: JSON.stringify(n.geom) },
          })),
        },
      } as GemeindenQueryResult
    },
  })

  if (!data) return null

  const nodes = data?.allChAdministrativeUnits?.nodes ?? []
  const gemeinden = nodes.map((n): Feature => ({
    type: 'Feature',
    properties: { Gemeinde: n.text ?? '' },
    geometry: JSON.parse(String(n?.geom?.geojson)),
  }))

  return (
    <GeoJSON
      // leaflet handles plain feature arrays like FeatureCollections,
      // but react-leaflet's data prop is typed as GeoJsonObject
      data={gemeinden as unknown as FeatureCollection}
      style={style}
      interactive={false}
    />
  )
}
