import { useSuspenseQuery } from '@tanstack/react-query'

import { apiFetch } from '../../../modules/api.ts'

export interface EkPlanYearCounts {
  kontrTpopsByYear: Map<number, Set<string>>
  ansiedlungTpopsByYear: Map<number, Set<string>>
  ekplanTpopsByYear: Map<number, Set<string>>
}

const addToYearMap = (
  map: Map<number, Set<string>>,
  year: number | null,
  tpopId: string,
) => {
  if (year === null) return
  const set = map.get(year)
  if (set) {
    set.add(tpopId)
  } else {
    map.set(year, new Set([tpopId]))
  }
}

/**
 * distinct tpop ids per year that have EKF-Kontrollen, Ansiedlungen or
 * Ek-Pläne — one shared query for all year columns of the header.
 *
 * The former per-column queries (~26 columns × 4 requests fired in
 * parallel) exhausted the PostgREST pool on production (#830).
 */
export const useEkPlanYearCounts = (
  tpopFilter: Record<string, unknown>,
  firstYear: number,
) =>
  useSuspenseQuery({
    queryKey: ['ekPlanYearCounts', tpopFilter, firstYear],
    queryFn: async (): Promise<EkPlanYearCounts> => {
      const kontrTpopsByYear = new Map<number, Set<string>>()
      const ansiedlungTpopsByYear = new Map<number, Set<string>>()
      const ekplanTpopsByYear = new Map<number, Set<string>>()

      // phase 5: the reverse `some` semantics (tpop matches filter AND has
      // a child in the year) become child queries with the tpop filter
      // nested into tpopByTpopId
      const tpopOf = (filter: object) => ({
        ...filter,
        tpopByTpopId: tpopFilter,
      })

      const [kontrRows, ansiedlungRows, tpops] = await Promise.all([
        apiFetch<{ tpop_id: string; jahr: number | null }[]>(
          '/rpc/query_tpopkontr?select=tpop_id,jahr',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: tpopOf({ jahr: { greaterThanOrEqualTo: firstYear } }),
            }),
          },
        ),
        apiFetch<{ tpop_id: string; jahr: number | null }[]>(
          '/rpc/query_tpopmassn?select=tpop_id,jahr',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: tpopOf({
                jahr: { greaterThanOrEqualTo: firstYear },
                tpopmassnTypWerteByTyp: { ansiedlung: { equalTo: true } },
              }),
            }),
          },
        ),
        apiFetch<{ id: string }[]>('/rpc/query_tpop?select=id', {
          method: 'POST',
          body: JSON.stringify({ p_filter: tpopFilter }),
        }),
      ])
      for (const row of kontrRows ?? []) {
        addToYearMap(kontrTpopsByYear, row.jahr, row.tpop_id)
      }
      for (const row of ansiedlungRows ?? []) {
        addToYearMap(ansiedlungTpopsByYear, row.jahr, row.tpop_id)
      }
      // ekplan has no query_ RPC — resolve tpop ids of the filter first
      const ids = (tpops ?? []).map((t) => t.id)
      if (ids.length) {
        const plans =
          (await apiFetch<{ tpop_id: string; jahr: number | null }[]>(
            `/ekplan?jahr=gte.${firstYear}&tpop_id=in.(${ids.join(',')})&select=tpop_id,jahr`,
          )) ?? []
        for (const plan of plans) {
          addToYearMap(ekplanTpopsByYear, plan.jahr, plan.tpop_id)
        }
      }
      return { kontrTpopsByYear, ansiedlungTpopsByYear, ekplanTpopsByYear }
    },
  })
