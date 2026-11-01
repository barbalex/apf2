import { useAtomValue, useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { apiFetch } from '../../../../../modules/api.ts'

import { Polyline } from './Polyline.tsx'
import type { BeobAssignLinesNode } from './Polyline.tsx'

import {
  addNotificationAtom,
  treeBeobGqlFilterAtom,
} from '../../../../../store/index.ts'

interface BeobAssignLinesQueryResult {
  allBeobs: {
    nodes: BeobAssignLinesNode[]
  }
}

const Polylines = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const beobZugeordnetGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('zugeordnet'),
  )

  const { data, error } = useQuery({
    queryKey: ['BeobAssignLinesQuery', beobZugeordnetGqlFilter.filtered],
    queryFn: async () => {
      const rows =
        (await apiFetch<
          {
            id: string
            tpop_id: string | null
            art_id: string | null
            wgs84_lat: number
            wgs84_long: number
            lv95_x: number
            lv95_y: number
            datum: string | null
            autor: string | null
            quelle: string | null
            absenz: boolean | null
          }[]
        >(
          '/rpc/query_beob?select=id,tpop_id,art_id,wgs84_lat,wgs84_long,lv95_x,lv95_y,datum,autor,quelle,absenz',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: beobZugeordnetGqlFilter.filtered,
            }),
          },
        )) ?? []

      // zugeordnet: the tpop context joins client-side
      const tpopIds = [
        ...new Set((rows ?? []).map((r) => r.tpop_id).filter(Boolean)),
      ]
      const tpops =
        tpopIds.length ?
          ((await apiFetch<
            {
              id: string
              pop_id: string | null
              nr: number | null
              flurname: string | null
            }[]
          >(
            `/q_tpop?id=in.(${tpopIds.join(',')})&select=id,pop_id,nr,flurname`,
          )) ?? [])
        : []
      const popIds = [...new Set(tpops.map((t) => t.pop_id).filter(Boolean))]
      const pops =
        popIds.length ?
          ((await apiFetch<{ id: string; label: string | null }[]>(
            `/q_pop?id=in.(${popIds.join(',')})&select=id,label`,
          )) ?? [])
        : []
      const tpopById = new Map(tpops.map((t) => [t.id, t]))
      const popById = new Map(pops.map((p) => [p.id, p]))
      const aeIds = [
        ...new Set((rows ?? []).map((r) => r.art_id).filter(Boolean)),
      ]
      const taxa =
        aeIds.length ?
          ((await apiFetch<{ id: string; artname: string | null }[]>(
            `/ae_taxonomies?id=in.(${aeIds.join(',')})&select=id,artname`,
          )) ?? [])
        : []
      const taxonById = new Map(taxa.map((t) => [t.id, t]))

      const nodes = (rows ?? []).map((r) => ({
        id: r.id,
        wgs84Lat: r.wgs84_lat,
        wgs84Long: r.wgs84_long,
        lv95X: r.lv95_x,
        lv95Y: r.lv95_y,
        datum: r.datum,
        autor: r.autor,
        quelle: r.quelle,
        absenz: r.absenz,
        aeTaxonomyByArtId:
          r.art_id ?
            { id: r.art_id, artname: taxonById.get(r.art_id)?.artname ?? null }
          : null,
        tpopByTpopId: (() => {
          const t = r.tpop_id ? tpopById.get(r.tpop_id) : undefined
          if (!t) return null
          const pop = t.pop_id ? popById.get(t.pop_id) : undefined
          return {
            id: t.id,
            popId: t.pop_id,
            nr: t.nr,
            flurname: t.flurname,
            popByPopId: pop ? { id: pop.id, label: pop.label } : null,
          }
        })(),
      }))
      return { allBeobs: { nodes } } as unknown as BeobAssignLinesQueryResult
    },
  })

  if (error) {
    addNotification({
      message: `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  return (data?.allBeobs?.nodes ?? []).map((beob) => (
    <Polyline
      key={beob.id}
      beob={beob}
    />
  ))
}

export const BeobZugeordnetAssignPolylines = () => {
  const beobZugeordnetGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('zugeordnet'),
  )

  const { apId } = useParams()

  // Problem: gqlFilter updates AFTER apId
  // if navigating from ap to pop, apId is set before gqlFilter
  // thus query fetches data for all aps
  // Solution: do not return pop if apId exists but gqlFilter does not contain it (yet)
  const gqlFilterHasApId =
    !!beobZugeordnetGqlFilter.filtered?.aeTaxonomyByArtId?.apartsByArtId?.some
      ?.apId
  const apIdExistsButGqlFilterDoesNotKnowYet = !!apId && !gqlFilterHasApId

  if (apIdExistsButGqlFilterDoesNotKnowYet) return null

  return <Polylines />
}
