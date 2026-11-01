import { GeoJSON } from 'react-leaflet'
import { useQuery } from '@tanstack/react-query'
import type { Feature, FeatureCollection } from 'geojson'
import { apiFetch } from '../../../../modules/api.ts'

interface DetailplanNode {
  id: string
  data: string | null
  geom: {
    geojson: string
  } | null
}

interface DetailplaeneQueryResult {
  allDetailplaenes: {
    nodes: DetailplanNode[]
  }
}

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

export const Detailplaene = () => {
  const { data } = useQuery({
    queryKey: ['detailplaene'],
    queryFn: async () => {
      // phase 5: the former geometry embed arrives as raw GeoJSON
      const nodes =
        (await apiFetch<{ id: string; data: string | null; geom: unknown }[]>(
          `/detailplaene?select=id,data,geom`,
        )) ?? []
      return {
        allDetailplaenes: {
          nodes: nodes.map((n) => ({
            id: n.id,
            data: n.data,
            geom: { geojson: JSON.stringify(n.geom) },
          })),
        },
      } as DetailplaeneQueryResult
    },
  })

  if (!data) return null

  const nodes = data?.allDetailplaenes?.nodes ?? []
  const detailplaene = nodes.map((n): Feature => ({
    type: 'Feature',
    properties: n.data ? JSON.parse(n.data) : null,
    geometry: JSON.parse(String(n?.geom?.geojson)),
  }))

  return (
    <GeoJSON
      // leaflet handles plain feature arrays like FeatureCollections,
      // but react-leaflet's data prop is typed as GeoJsonObject
      data={detailplaene as unknown as FeatureCollection}
      style={style}
      interactive={false}
    />
  )
}
