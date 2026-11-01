import { GeoJSON } from 'react-leaflet'
import 'leaflet'
import { useQuery } from '@tanstack/react-query'
import type { Feature, FeatureCollection } from 'geojson'
import type { LatLng } from 'leaflet'
import { apiFetch } from '../../../../modules/api.ts'

interface MarkierungNode {
  id: number
  gebiet: string | null
  pfostennum: string | null
  markierung: string | null
  wkbGeometry: {
    geojson: string
  } | null
}

interface MarkierungenQueryResult {
  allMarkierungens: {
    nodes: MarkierungNode[]
  }
}

const style = () => ({
  fill: true,
  fillOpacity: 0,
  color: 'orange',
  weight: 1,
  opacity: 1,
})
const pTLOptions = {
  radius: 3,
  fillColor: '#ff7800',
  color: '#000',
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
}
const pointToLayer = (_feature: Feature, latlng: LatLng) =>
  window.L.circleMarker(latlng, pTLOptions)

export const Markierungen = () => {
  const { data } = useQuery({
    queryKey: ['markierungen'],
    queryFn: async () => {
      const nodes =
        (await apiFetch<
          {
            ogc_fid: number
            gebiet: string | null
            pfostennum: string | null
            markierung: string | null
            wkb_geometry: unknown
          }[]
        >(
          `/markierungen?select=ogc_fid,gebiet,pfostennum,markierung,wkb_geometry`,
        )) ?? []
      return {
        allMarkierungens: {
          nodes: nodes.map((n) => ({
            id: n.ogc_fid,
            gebiet: n.gebiet,
            pfostennum: n.pfostennum,
            markierung: n.markierung,
            wkbGeometry: { geojson: JSON.stringify(n.wkb_geometry) },
          })),
        },
      } as MarkierungenQueryResult
    },
  })

  if (!data) return null

  const nodes = data?.allMarkierungens?.nodes ?? []
  const markierungen = nodes.map((n): Feature => ({
    type: 'Feature',
    properties: {
      Gebiet: n.gebiet ?? '',
      PfostenNr: n.pfostennum ?? '',
      Markierung: n.markierung ?? '',
    },
    geometry: JSON.parse(String(n?.wkbGeometry?.geojson)),
  }))

  return (
    <GeoJSON
      // leaflet handles plain feature arrays like FeatureCollections,
      // but react-leaflet's data prop is typed as GeoJsonObject
      data={markierungen as unknown as FeatureCollection}
      style={style}
      pointToLayer={pointToLayer}
      interactive={false}
    />
  )
}
