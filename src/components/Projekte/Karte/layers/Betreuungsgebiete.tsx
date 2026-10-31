import { apiFetch } from '../../../../modules/api.ts'
// https://stackoverflow.com/a/25296972/712005
// also: https://gis.stackexchange.com/a/130553/13491
import { GeoJSON } from 'react-leaflet'
import { useQuery } from '@tanstack/react-query'
import type { Feature, FeatureCollection } from 'geojson'

interface BetreuungsgebietNode {
  id: number
  geom: {
    geojson: string
  } | null
}

interface BetreuungsgebieteQueryResult {
  allNsBetreuungs: {
    nodes: BetreuungsgebietNode[]
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

export const Betreuungsgebiete = () => {
  const { data } = useQuery({
    queryKey: ['betreuungsgebiete'],
    queryFn: async () => {
      // phase 5: the former geometry embed arrives as raw GeoJSON
      const nodes =
        (await apiFetch<{ gebiet_nr: number; geom: unknown }[]>(
          `/ns_betreuung?select=gebiet_nr:gebiet_nr,geom`,
        )) ?? []
      return {
        allNsBetreuungs: {
          nodes: nodes.map((n) => ({
            id: n.gebiet_nr,
            geom: { geojson: JSON.stringify(n.geom) },
          })),
        },
      } as BetreuungsgebieteQueryResult
    },
    // suspense: true provokes a weird error:
    // Map container is being reused by another instance
    // suspense: true,
  })

  if (!data) return null

  const nodes = data?.allNsBetreuungs?.nodes ?? []
  const betrGebiete = nodes.map((n): Feature => ({
    type: 'Feature',
    properties: {},
    geometry: JSON.parse(String(n?.geom?.geojson)),
  }))

  return (
    <GeoJSON
      // leaflet handles plain feature arrays like FeatureCollections,
      // but react-leaflet's data prop is typed as GeoJsonObject
      data={betrGebiete as unknown as FeatureCollection}
      style={style}
      interactive={false}
    />
  )
}
