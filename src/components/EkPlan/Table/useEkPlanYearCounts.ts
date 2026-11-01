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
 * parallel) exhausted the PostgREST pool on production, and the ekplan
 * counts were fetched with a GET holding every tpop id in its URL — a
 * ~30 kB URL that Caddy's http/2 server kills the whole connection
 * over (#830). All requests now carry their payload in the body.
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

      // ekplan has no query_ RPC — its rows come embedded in query_tpop,
      // which keeps every tpop id out of the URL
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
        apiFetch<{ id: string; ekplan: { jahr: number | null }[] }[]>(
          '/rpc/query_tpop?select=id,ekplan(jahr)',
          {
            method: 'POST',
            body: JSON.stringify({ p_filter: tpopFilter }),
          },
        ),
      ])
      for (const row of kontrRows ?? []) {
        addToYearMap(kontrTpopsByYear, row.jahr, row.tpop_id)
      }
      for (const row of ansiedlungRows ?? []) {
        addToYearMap(ansiedlungTpopsByYear, row.jahr, row.tpop_id)
      }
      for (const tpop of tpops ?? []) {
        for (const plan of tpop.ekplan ?? []) {
          addToYearMap(ekplanTpopsByYear, plan.jahr, tpop.id)
        }
      }
      return { kontrTpopsByYear, ansiedlungTpopsByYear, ekplanTpopsByYear }
    },
  })
