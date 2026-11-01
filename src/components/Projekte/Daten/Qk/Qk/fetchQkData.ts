/**
 * phase 5: fetches only the ACTIVE quality-control checks via REST —
 * the former 2400-line @include-parameterized GraphQL document.
 * Three check families:
 * 1. v_q_* views / q_* db functions: one GET/RPC each (generated mapping)
 * 2. projektById-wrapped checks: query_* RPCs with the ap nested into the
 *    filter; the projektById/apsByProjId wrapper chain is reconstructed
 *    client-side (it always resolved to the single ap)
 * 3. reverse-`some` checks (2): client-side filtering
 * The returned shape matches QkQueryData exactly, so createMessageFunctions
 * stays unchanged.
 */
import { apiFetch } from '../../../../../modules/api.ts'

import type { QkQueryData } from './createMessageFunctions.ts'

interface FetchQkDataArgs {
  projId: string
  apId: string
  berichtjahr: number | null
  activeChecks: Record<string, boolean>
  minDatum: string
  maxDatum: string
}

// ── shared context ────────────────────────────────────────────────────
interface PopCtx {
  id: string
  nr: number | null
  name: string | null
}
interface TpopCtx {
  id: string
  nr: number | null
  pop_id: string
}

let popsCache: PopCtx[] | null = null
let tpopsCache: TpopCtx[] | null = null
let einheitWerteCache: Map<number, boolean> | null = null

export const fetchQkData = async ({
  projId,
  apId,
  berichtjahr,
  activeChecks,
  minDatum,
  maxDatum,
}: FetchQkDataArgs): Promise<QkQueryData> => {
  popsCache = null
  tpopsCache = null
  einheitWerteCache = null

  const allPops = async () => {
    popsCache ??=
      (await apiFetch<PopCtx[]>(
        `/q_pop?ap_id=eq.${apId}&select=id,nr,name&order=nr.asc`,
      )) ?? []
    return popsCache
  }
  const allTpops = async () => {
    tpopsCache ??=
      (await apiFetch<TpopCtx[]>('/rpc/query_tpop?select=id,nr,pop_id', {
        method: 'POST',
        body: JSON.stringify({
          p_filter: { popByPopId: { apByApId: { id: { equalTo: apId } } } },
          p_order: [{ field: 'nr', dir: 'asc' }],
        }),
      })) ?? []
    return tpopsCache
  }
  /** code → needsNoMethodeAnzahl */
  const einheitWerte = async () => {
    if (einheitWerteCache) return einheitWerteCache
    const rows =
      (await apiFetch<
        { code: number; needs_no_methode_anzahl: boolean | null }[]
      >(
        `/tpopkontrzaehl_einheit_werte?select=code,needs_no_methode_anzahl:needs_no_methode_anzahl`,
      )) ?? []
    einheitWerteCache = new Map(
      rows.map((r) => [r.code, r.needs_no_methode_anzahl === true]),
    )
    return einheitWerteCache
  }

  // ── filter helpers ─────────────────────────────────────────────────
  const apOf = (cond: object) => ({ id: { equalTo: apId }, ...cond })
  const apChildOf = (cond: object) => ({
    apByApId: { id: { equalTo: apId } },
    ...cond,
  })
  const popOf = (cond: object) => ({
    apByApId: { id: { equalTo: apId } },
    ...cond,
  })
  const tpopOf = (cond: object) => ({
    popByPopId: { apByApId: { id: { equalTo: apId } } },
    ...cond,
  })
  const tpopChildOf = (cond: object) => ({
    tpopByTpopId: { popByPopId: { apByApId: { id: { equalTo: apId } } } },
    ...cond,
  })
  const popChildOf = (cond: object) => ({
    popByPopId: { apByApId: { id: { equalTo: apId } } },
    ...cond,
  })

  const rpc = <T>(
    fn: string,
    select: string,
    p_filter: object,
    p_order?: object[],
  ) =>
    apiFetch<T[]>(`/rpc/${fn}?select=${select}`, {
      method: 'POST',
      body: JSON.stringify({
        p_filter,
        ...(p_order ? { p_order } : {}),
      }),
    })

  // ── wrapper builders (reconstruct the projektById chains) ─────────
  const apWrap = (nodes: object[]) => ({ apsByProjId: { nodes } })
  const popWrap = (pops: object[]) =>
    apWrap([{ id: apId, popsByApId: { nodes: pops } }])
  /** tpop rows (with pop_id) grouped under their pops */
  const tpopWrapFromRows = (
    rows: { id: string; nr: number | null; pop_id: string }[],
  ) => {
    const tpopsByPop = new Map<
      string,
      {
        id: string
        nr: number | null
        popByPopId: { id: string; nr: number | null }
      }[]
    >()
    for (const t of rows) {
      const pop = (popsCache ?? []).find((p) => p.id === t.pop_id)
      const list = tpopsByPop.get(t.pop_id) ?? []
      list.push({
        id: t.id,
        nr: t.nr,
        popByPopId: { id: t.pop_id, nr: pop?.nr ?? null },
      })
      tpopsByPop.set(t.pop_id, list)
    }
    return popWrap(
      [...tpopsByPop.entries()].map(([popId, tpops]) => ({
        id: popId,
        tpopsByPopId: { nodes: tpops },
      })),
    )
  }
  /** child rows (with tpop_id) grouped tpop → pop */
  const tpopChildWrapFromRows = (
    rows: { id: string; jahr: number | null; tpop_id: string }[],
    extra?: (r: Record<string, unknown>) => object,
  ) => {
    const childByTpop = new Map<string, unknown[]>()
    for (const r of rows as Record<string, unknown>[]) {
      const tpopId = r.tpop_id as string
      const tpop = (tpopsCache ?? []).find((t) => t.id === tpopId)
      const pop =
        tpop ? (popsCache ?? []).find((p) => p.id === tpop.pop_id) : undefined
      const list = childByTpop.get(tpopId) ?? []
      list.push({
        id: r.id,
        jahr: r.jahr,
        ...(extra ? extra(r) : {}),
        tpopByTpopId: {
          id: tpopId,
          nr: tpop?.nr ?? null,
          popByPopId: {
            id: tpop?.pop_id ?? null,
            nr: pop?.nr ?? null,
          },
        },
      })
      childByTpop.set(tpopId, list)
    }
    // group children under tpops under pops
    const tpopsWithChildren = [...childByTpop.entries()].map(
      ([tpopId, children]) => {
        const tpop = (tpopsCache ?? []).find((t) => t.id === tpopId)
        return {
          id: tpopId,
          nr: tpop?.nr ?? null,
          popByPopId: { id: tpop?.pop_id ?? null, nr: null },
          tpopChildRel: { nodes: children },
        }
      },
    )
    const tpopsByPop = new Map<string, typeof tpopsWithChildren>()
    for (const t of tpopsWithChildren) {
      const tpop = (tpopsCache ?? []).find((x) => x.id === t.id)
      const popId = tpop?.pop_id ?? ''
      const list = tpopsByPop.get(popId) ?? []
      list.push(t)
      tpopsByPop.set(popId, list)
    }
    return popWrap(
      [...tpopsByPop.entries()].map(([popId, tpops]) => ({
        id: popId,
        tpopsByPopId: { nodes: tpops },
      })),
    )
  }

  // ── check helpers ──────────────────────────────────────────────────
  const apCheck = async (cond: object) => {
    const nodes = (await rpc('query_ap', 'id', apOf(cond))) ?? []
    return apWrap(nodes.map((a) => ({ id: (a as { id: string }).id })))
  }
  const apChildCheck = async (
    fn: string,
    cond: object,
    order: object[],
    select: string,
    map: (r: Record<string, unknown>) => object,
    relKey: string,
  ) => {
    const rows = (await rpc(fn, select, apChildOf(cond), order)) ?? []
    return apWrap([
      {
        id: apId,
        [relKey]: { nodes: rows.map((r) => map(r as Record<string, unknown>)) },
      },
    ])
  }
  const popCheck = async (
    cond: object,
    order: object[],
    map: (p: Record<string, unknown>) => object,
  ) => {
    await allPops()
    const rows =
      (await rpc('query_pop', 'id,nr,name', popOf(cond), order)) ?? []
    return popWrap(rows.map((p) => map(p as Record<string, unknown>)))
  }
  const popChildCheck = async (
    fn: string,
    cond: object,
    order: object[],
    select: string,
  ) => {
    await Promise.all([allPops(), allTpops()])
    const rows = (await rpc(fn, select, popChildOf(cond), order)) ?? []
    const childByPop = new Map<string, unknown[]>()
    for (const r of rows as Record<string, unknown>[]) {
      const pop = (popsCache ?? []).find((p) => p.id === r.pop_id)
      const list = childByPop.get(r.pop_id as string) ?? []
      list.push({
        id: r.id,
        jahr: r.jahr,
        popByPopId: { id: r.pop_id, nr: pop?.nr ?? null },
      })
      childByPop.set(r.pop_id as string, list)
    }
    return popWrap(
      [...childByPop.entries()].map(([popId, nodes]) => ({
        id: popId,
        popChildRel: { nodes },
      })),
    )
  }
  const tpopCheck = async (cond: object, order: object[]) => {
    await Promise.all([allPops(), allTpops()])
    const rows =
      (await rpc('query_tpop', 'id,nr,pop_id', tpopOf(cond), order)) ?? []
    return tpopWrapFromRows(
      rows as { id: string; nr: number | null; pop_id: string }[],
    )
  }
  const tpopChildCheck = async (fn: string, cond: object, order: object[]) => {
    await Promise.all([allPops(), allTpops()])
    const rows =
      (await rpc(fn, 'id,jahr,tpop_id', tpopChildOf(cond), order)) ?? []
    return tpopChildWrapFromRows(
      rows as { id: string; jahr: number | null; tpop_id: string }[],
    )
  }
  const kontrWithoutZaehlung = async (typOp: 'equalTo' | 'notEqualTo') => {
    await Promise.all([allPops(), allTpops()])
    const kontrs =
      (await rpc(
        'query_tpopkontr',
        'id,jahr,tpop_id',
        tpopChildOf({
          typ: { [typOp]: 'Freiwilligen-Kontrolle' },
          jahr: { equalTo: berichtjahr },
        }),
        [{ field: 'jahr', dir: 'asc' }],
      )) ?? []
    const kontrIds = kontrs.map((k) => (k as { id: string }).id)
    const zaehls =
      kontrIds.length ?
        ((await apiFetch<{ tpopkontr_id: string }[]>(
          `/q_tpopkontrzaehl?tpopkontr_id=in.(${kontrIds.join(',')})&select=tpopkontr_id`,
        )) ?? [])
      : []
    const withZaehl = new Set(zaehls.map((z) => z.tpopkontr_id))
    const matching = kontrs.filter(
      (k) => !withZaehl.has((k as { id: string }).id),
    ) as { id: string; jahr: number | null; tpop_id: string }[]
    return tpopChildWrapFromRows(matching, () => ({
      tpopkontrzaehlsByTpopkontrId: { totalCount: 0 },
    }))
  }
  /**
   * zaehlung checks: kontrs of the year with two zaehlung lists each —
   * "ohne X" (X missing AND einheit needs anzahl/methode) and "mit X" —
   * the messages compare the two lists' lengths
   */
  const zaehlungCheck = async (
    typOp: 'equalTo' | 'notEqualTo',
    field: 'einheit' | 'methode' | 'anzahl',
  ) => {
    await Promise.all([allPops(), allTpops()])
    const [kontrs, werte] = await Promise.all([
      rpc(
        'query_tpopkontr',
        'id,jahr,tpop_id',
        tpopChildOf({
          typ: { [typOp]: 'Freiwilligen-Kontrolle' },
          jahr: { equalTo: berichtjahr },
        }),
        [{ field: 'jahr', dir: 'asc' }],
      ),
      einheitWerte(),
    ])
    const kontrIds = (kontrs ?? []).map((k) => (k as { id: string }).id)
    const zaehls =
      kontrIds.length ?
        ((await apiFetch<
          {
            id: string
            tpopkontr_id: string
            einheit: number | null
            methode: number | null
            anzahl: number | null
          }[]
        >(
          `/q_tpopkontrzaehl?tpopkontr_id=in.(${kontrIds.join(',')})&select=id,tpopkontr_id,einheit,methode,anzahl`,
        )) ?? [])
      : []
    const zaehlsByKontr = new Map<string, typeof zaehls>()
    for (const z of zaehls) {
      const list = zaehlsByKontr.get(z.tpopkontr_id) ?? []
      list.push(z)
      zaehlsByKontr.set(z.tpopkontr_id, list)
    }
    const needsCheck = (z: (typeof zaehls)[number]) => {
      const needs = z.einheit != null ? (werte.get(z.einheit) ?? false) : false
      // needsNoMethodeAnzahl true → the field is optional
      return !needs
    }
    return tpopChildWrapFromRows(
      (kontrs ?? []) as { id: string; jahr: number | null; tpop_id: string }[],
      (r) => {
        const kontrId = r.id as string
        const list = zaehlsByKontr.get(kontrId) ?? []
        const ohnes = list.filter((z) => z[field] == null && needsCheck(z))
        const mits = list.filter((z) => z[field] != null || !needsCheck(z))
        return {
          [`zaehlungenOhne${
            field === 'einheit' ? 'Einheit'
            : field === 'methode' ? 'Methode'
            : 'Anzahl'
          }`]: {
            nodes: ohnes.map((z) => ({ id: z.id })),
          },
          [`zaehlungenMit${
            field === 'einheit' ? 'Einheit'
            : field === 'methode' ? 'Methode'
            : 'Anzahl'
          }`]: {
            nodes: mits.map((z) => ({ id: z.id })),
          },
        }
      },
    )
  }

  // ── the check fetchers ─────────────────────────────────────────────
  const fetchers: Record<string, () => Promise<unknown>> = {
    tpopsOutsideZh: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          '/rpc/tpop_outside_zh_for_ap_function?select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr',
          {
            method: 'POST',
            body: JSON.stringify({ ap_id: apId, proj_id: projId }),
          },
        )) ?? [],
    }),
    apMitAktKontrOhneZielrelevanteEinheit: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          '/rpc/q_ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit?select=projId:proj_id,apId:ap_id',
          {
            method: 'POST',
            body: JSON.stringify({ berichtjahr: berichtjahr, ap_id: apId }),
          },
        )) ?? [],
    }),
    ekzieleinheitOhneMassnZaehleinheit: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_ekzieleinheit_ohne_massn_zaehleinheit?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,artname:artname,zaehleinheit:zaehleinheit`,
        )) ?? [],
    }),
    popBekanntSeitNichtAeltesteTpop: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_bekanntseit_nicht_aeltestetpop?ap_id=eq.${apId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popMitMehrdeutigerNr: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_popnrmehrdeutig?ap_id=eq.${apId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popOhnePopber: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          '/rpc/q_pop_ohne_popber?select=projId:proj_id,apId:ap_id,id:id,nr:nr',
          {
            method: 'POST',
            body: JSON.stringify({
              projid: projId,
              apid: apId,
              berichtjahr: berichtjahr,
            }),
          },
        )) ?? [],
    }),
    popMitBerZunehmendOhneTpopberZunehmend: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend?ap_id=eq.${apId}&proj_id=eq.${projId}&berichtjahr=eq.${berichtjahr}&select=projId:proj_id,apId:ap_id,id:id,nr:nr,berichtjahr:berichtjahr`,
        )) ?? [],
    }),
    popMitBerAbnehmendOhneTpopberAbnehmend: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend?ap_id=eq.${apId}&proj_id=eq.${projId}&berichtjahr=eq.${berichtjahr}&select=projId:proj_id,apId:ap_id,id:id,nr:nr,berichtjahr:berichtjahr`,
        )) ?? [],
    }),
    popMitBerErloschenOhneTpopberErloschen: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_mit_ber_erloschen_ohne_tpopber_erloschen?ap_id=eq.${apId}&proj_id=eq.${projId}&berichtjahr=eq.${berichtjahr}&select=projId:proj_id,apId:ap_id,id:id,nr:nr,berichtjahr:berichtjahr`,
        )) ?? [],
    }),
    popMitBerErloschenUndTpopberNichtErloschen: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen?ap_id=eq.${apId}&proj_id=eq.${projId}&berichtjahr=eq.${berichtjahr}&select=projId:proj_id,apId:ap_id,id:id,nr:nr,berichtjahr:berichtjahr`,
        )) ?? [],
    }),
    popOhneTpopMitGleichemStatus: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_ohnetpopmitgleichemstatus?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatus300TpopStatusAnders: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_status300tpopstatusanders?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatus201TpopStatusUnzulaessig: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_status201tpopstatusunzulaessig?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatus202TpopStatusAnders: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_status202tpopstatusanders?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatus200TpopStatusUnzulaessig: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_status200tpopstatusunzulaessig?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatus101TpopStatusAnders: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_status101tpopstatusanders?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusErloschenLetzterPopberZunehmend: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statuserloschenletzterpopberzunehmend?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusErloschenLetzterPopberStabil: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statuserloschenletzterpopberstabil?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusErloschenLetzterPopberAbnehmend: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statuserloschenletzterpopberabnehmend?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusErloschenLetzterPopberUnsicher: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statuserloschenletzterpopberunsicher?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popOhnePopmassnber: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          '/rpc/q_pop_ohne_popmassnber?select=projId:proj_id,apId:ap_id,id:id,nr:nr',
          {
            method: 'POST',
            body: JSON.stringify({
              projid: projId,
              apid: apId,
              berichtjahr: berichtjahr,
            }),
          },
        )) ?? [],
    }),
    popKoordEntsprechenKeinerTpop: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_koordentsprechenkeinertpop?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusAnsaatversuchTpopAktuell: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statusansaatversuchmitaktuellentpop?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusAnsaatversuchAlleTpopErloschen: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statusansaatversuchalletpoperloschen?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusAnsaatversuchMitTpopUrspruenglichErloschen: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statusansaatversuchmittpopursprerloschen?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusErloschenMitTpopAktuell: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statuserloschenmittpopaktuell?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusErloschenMitTpopAnsaatversuch: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statuserloschenmittpopansaatversuch?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusUrspruenglichWiederauferstanden: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_urspruenglich_wiederauferstanden?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusAngesiedeltMitTpopUrspruenglich: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statusangesiedeltmittpopurspruenglich?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusAktuellLetzterPopberErloschen: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statusaktuellletzterpopbererloschen?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusErloschenLetzterPopberAktuell: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statuserloschenletzterpopberaktuell?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    popStatusErloschenLetzterPopberErloschenMitAnsiedlung: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_pop_statuserloschenletzterpopbererloschenmitansiedlung?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopOhneTpopber: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          '/rpc/q_tpop_ohne_tpopber?select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr',
          {
            method: 'POST',
            body: JSON.stringify({
              projid: projId,
              apid: apId,
              berichtjahr: berichtjahr,
            }),
          },
        )) ?? [],
    }),
    tpopOhneMassnber: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          '/rpc/q_tpop_ohne_massnber?select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr',
          {
            method: 'POST',
            body: JSON.stringify({
              projid: projId,
              apid: apId,
              berichtjahr: berichtjahr,
            }),
          },
        )) ?? [],
    }),
    tpopCountedEinheitMultipleTimesInYear: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          '/rpc/q_tpop_counted_einheit_multiple_times_in_year?select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr,einheit:einheit,anzahl:anzahl',
          {
            method: 'POST',
            body: JSON.stringify({
              projid: projId,
              apid: apId,
              berichtjahr: berichtjahr,
            }),
          },
        )) ?? [],
    }),
    tpopBekanntSeitJuengerAlsAeltesteBeob: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_bekanntseit_juenger_als_aelteste_beob?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopStatusAktuellLetzterTpopberErloschen: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_statusaktuellletztertpopbererloschen?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopStatusErloschenLetzterTpopberStabil: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_statuserloschenletztertpopberstabil?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopStatusErloschenLetzterTpopberAbnehmend: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_statuserloschenletztertpopberabnehmend?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopStatusErloschenLetzterTpopberUnsicher: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_statuserloschenletztertpopberunsicher?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopStatusErloschenLetzterTpopberZunehmend: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_statuserloschenletztertpopberzunehmend?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopStatusErloschenLetzterTpopberAktuell: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_statuserloschenletzterpopberaktuell?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopStatusErloschenLetzterTpopberErloschenMitAnsiedlung: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_statuserloschenletztertpopbererloschenmitansiedlung?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopErloschenMitEkplanNachLetztemTpopber: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_erloschen_mit_ekplan_nach_letztem_tpopber?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopErloschenUndRelevantLetzteBeobVor1950: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_erloschenundrelevantaberletztebeobvor1950?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopPopnrTponrMehrdeutig: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_popnrtpopnrmehrdeutig?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopMitStatusAnsaatversuchUndZaehlungMitAnzahl: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_mitstatusansaatversuchundzaehlungmitanzahl?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopMitStatusPotentiellUndZaehlungMitAnzahl: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_mitstatuspotentiellundzaehlungmitanzahl?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopMitStatusPotentiellUndAnsiedlung: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_mitstatuspotentiellundmassnansiedlung?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr`,
        )) ?? [],
    }),
    tpopErsteMassnVorBekanntSeit: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_tpop_erste_massn_vor_bekannt_seit?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr,bemerkung:bemerkung`,
        )) ?? [],
    }),
    tpopMitAktuellenKontrollenOhneZielrelevanteEinheit: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          '/rpc/q_tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit?select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr',
          {
            method: 'POST',
            body: JSON.stringify({
              berichtjahr: berichtjahr,
              proj_id: projId,
              ap_id: apId,
            }),
          },
        )) ?? [],
    }),
    tpopMitAktuellenAnpflanzungenOhneZielrelevanteEinheit: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          '/rpc/q_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit?select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,id:id,nr:nr',
          {
            method: 'POST',
            body: JSON.stringify({
              berichtjahr: berichtjahr,
              proj_id: projId,
              ap_id: apId,
            }),
          },
        )) ?? [],
    }),
    anpflanzungOhneZielrelevanteEinheit: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_anpflanzung_ohne_zielrelevante_einheit?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,tpopId:tpop_id,tpopNr:tpop_nr,id:id,jahr:jahr`,
        )) ?? [],
    }),
    anpflanzungZielrelevanteEinheitFalsch: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_anpflanzung_zielrelevante_einheit_falsch?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,tpopId:tpop_id,tpopNr:tpop_nr,id:id,jahr:jahr,ekZieleinheit:ek_zieleinheit,massnZieleinheit:massn_zieleinheit`,
        )) ?? [],
    }),
    anpflanzungZielrelevanteAnzahlFalsch: async () => ({
      nodes:
        (await apiFetch<Record<string, unknown>[]>(
          `/v_q_anpflanzung_zielrelevante_anzahl_falsch?ap_id=eq.${apId}&proj_id=eq.${projId}&select=projId:proj_id,apId:ap_id,popId:pop_id,popNr:pop_nr,tpopId:tpop_id,tpopNr:tpop_nr,id:id,jahr:jahr,ekZieleinheit:ek_zieleinheit,zieleinheitAnzahl:zieleinheit_anzahl,anzahl:anzahl`,
        )) ?? [],
    }),

    // ── projektById-wrapper checks ───────────────────────────────────────
    // the wrapper chains are reconstructed client-side: the projektById/
    // apsByProjId levels always resolved to the single ap
    apOhneBearbeitung: async () => apCheck({ bearbeitung: { isNull: true } }),
    apMitApOhneUmsetzung: async () =>
      apCheck({ bearbeitung: { lessThan: 4 }, umsetzung: { isNull: true } }), // @485
    apOhneVerantwortlich: async () => apCheck({ bearbeiter: { isNull: true } }),
    zielOhneJahr: async () =>
      apChildCheck(
        'query_ziel',
        { or: [{ jahr: { equalTo: 1 } }, { jahr: { isNull: true } }] },
        [{ field: 'id', dir: 'asc' }],
        'id,jahr',
        (r) => ({ id: r.id, jahr: r.jahr }),
        'zielsByApId',
      ),
    zielOhneTyp: async () =>
      apChildCheck(
        'query_ziel',
        { typ: { isNull: true }, jahr: { equalTo: berichtjahr } },
        [{ field: 'jahr', dir: 'asc' }],
        'id,jahr',
        (r) => ({ id: r.id, jahr: r.jahr }),
        'zielsByApId',
      ),
    zielOhneZiel: async () =>
      apChildCheck(
        'query_ziel',
        { bezeichnung: { isNull: true }, jahr: { equalTo: berichtjahr } },
        [{ field: 'jahr', dir: 'asc' }],
        'id,jahr',
        (r) => ({ id: r.id, jahr: r.jahr }),
        'zielsByApId',
      ),
    erfkritOhneBeurteilung: async () =>
      apChildCheck(
        'query_erfkrit',
        { erfolg: { isNull: true } },
        [{ field: 'id', dir: 'asc' }],
        'id',
        (r) => ({ id: r.id }),
        'erfkritsByApId',
      ),
    erfkritOhneKriterien: async () =>
      apChildCheck(
        'query_erfkrit',
        { kriterien: { isNull: true } },
        [{ field: 'id', dir: 'asc' }],
        'id',
        (r) => ({ id: r.id }),
        'erfkritsByApId',
      ),
    apberOhneJahr: async () =>
      apChildCheck(
        'query_apber',
        { jahr: { isNull: true } },
        [{ field: 'id', dir: 'asc' }],
        'id',
        (r) => ({ id: r.id }),
        'apbersByApId',
      ),
    apberOhneVergleichVorjahrGesamtziel: async () =>
      apChildCheck(
        'query_apber',
        {
          vergleich_vorjahr_gesamtziel: { isNull: true },
          jahr: { equalTo: berichtjahr },
        },
        [{ field: 'jahr', dir: 'asc' }],
        'id,jahr',
        (r) => ({ id: r.id, jahr: r.jahr }),
        'apbersByApId',
      ),
    apberOhneBeurteilung: async () =>
      apChildCheck(
        'query_apber',
        { beurteilung: { isNull: true }, jahr: { equalTo: berichtjahr } },
        [{ field: 'jahr', dir: 'asc' }],
        'id,jahr',
        (r) => ({ id: r.id, jahr: r.jahr }),
        'apbersByApId',
      ),
    assozartOhneArt: async () =>
      apChildCheck(
        'query_assozart',
        { ae_id: { isNull: true } },
        [{ field: 'id', dir: 'asc' }],
        'id',
        (r) => ({ id: r.id }),
        'assozartsByApId',
      ),
    popOhneNr: async () =>
      popCheck(
        { nr: { isNull: true } },
        [{ field: 'name', dir: 'asc' }],
        (p) => ({
          id: p.id,
          name: p.name,
        }),
      ),
    popOhneName: async () =>
      popCheck(
        { name: { isNull: true } },
        [{ field: 'nr', dir: 'asc' }],
        (p) => ({
          id: p.id,
          nr: p.nr,
        }),
      ),
    popOhneStatus: async () =>
      popCheck(
        { status: { isNull: true } },
        [{ field: 'nr', dir: 'asc' }],
        (p) => ({
          id: p.id,
          nr: p.nr,
        }),
      ),
    popOhneBekanntSeit: async () =>
      popCheck(
        { bekannt_seit: { isNull: true } },
        [{ field: 'nr', dir: 'asc' }],
        (p) => ({
          id: p.id,
          nr: p.nr,
        }),
      ),
    popOhneKoord: async () =>
      popCheck(
        { lv95X: { isNull: true } },
        [{ field: 'nr', dir: 'asc' }],
        (p) => ({
          id: p.id,
          nr: p.nr,
        }),
      ),
    popOhneTpop: async () => {
      // pops with zero tpops (former tpopsByPopId totalCount === 0)
      const tpops = await allTpops()
      const popsWithTpop = new Set(tpops.map((t) => t.pop_id))
      const pops = (await allPops()).filter((p) => !popsWithTpop.has(p.id))
      return popWrap(
        pops.map((p) => ({
          id: p.id,
          nr: p.nr,
          tpopsByPopId: { totalCount: 0 },
        })),
      )
    },
    popMitStatusUnklarOhneBegruendung: async () =>
      popCheck(
        {
          status_unklar: { equalTo: true },
          status_unklar_begruendung: { isNull: true },
        },
        [{ field: 'nr', dir: 'asc' }],
        (p) => ({ id: p.id, nr: p.nr }),
      ),
    popberOhneJahr: async () =>
      popChildCheck(
        'query_popber',
        { jahr: { isNull: true } },
        [{ field: 'id', dir: 'asc' }],
        'id,jahr,pop_id',
      ),
    popberOhneEntwicklung: async () =>
      popChildCheck(
        'query_popber',
        { entwicklung: { isNull: true }, jahr: { equalTo: berichtjahr } },
        [{ field: 'jahr', dir: 'asc' }],
        'id,jahr,pop_id',
      ),
    popmassnberOhneJahr: async () =>
      popChildCheck(
        'query_popmassnber',
        { jahr: { isNull: true } },
        [{ field: 'id', dir: 'asc' }],
        'id,jahr,pop_id',
      ),
    popmassnberOhneEntwicklung: async () =>
      popChildCheck(
        'query_popmassnber',
        { beurteilung: { isNull: true }, jahr: { equalTo: berichtjahr } },
        [{ field: 'jahr', dir: 'asc' }],
        'id,jahr,pop_id',
      ),
    tpopOhneNr: async () =>
      tpopCheck({ nr: { isNull: true } }, [{ field: 'id', dir: 'asc' }]),
    tpopOhneFlurname: async () =>
      tpopCheck({ flurname: { isNull: true } }, [{ field: 'nr', dir: 'asc' }]),
    tpopOhneStatus: async () =>
      tpopCheck({ status: { isNull: true } }, [{ field: 'nr', dir: 'asc' }]),
    tpopOhneBekanntSeit: async () =>
      tpopCheck({ bekannt_seit: { isNull: true } }, [
        { field: 'nr', dir: 'asc' },
      ]),
    tpopOhneApberRelevant: async () =>
      tpopCheck({ apber_relevant: { isNull: true } }, [
        { field: 'nr', dir: 'asc' },
      ]),
    tpopAbperNichtRelevantOhneGrund: async () =>
      tpopCheck(
        {
          apber_relevant: { equalTo: false },
          apber_relevant_grund: { isNull: true },
        },
        [{ field: 'nr', dir: 'asc' }],
      ),
    tpopAbperNichtRelevantGrundHistorischStatusAktuell: async () =>
      tpopCheck(
        { apber_relevant_grund: { equalTo: 2 }, status: { in: [100, 200] } },
        [{ field: 'nr', dir: 'asc' }],
      ),
    tpopOhneKoord: async () =>
      tpopCheck({ lv95X: { isNull: true } }, [{ field: 'nr', dir: 'asc' }]),
    tpopStatusPotentiellApberrelevant: async () =>
      tpopCheck(
        { status: { equalTo: 300 }, apber_relevant: { equalTo: true } },
        [{ field: 'nr', dir: 'asc' }],
      ),
    tpopStatusUnklarOhneBegruendung: async () =>
      tpopCheck(
        {
          status_unklar: { equalTo: true },
          status_unklar_grund: { isNull: true },
        },
        [{ field: 'nr', dir: 'asc' }],
      ),
    tpopStatusAngesiedeltAktuellMitAnsaatOhneZaehlung: async () => {
      // reverse `some`/`none` filters run client-side (compile_filter has no
      // reverse relations): tpops with status 200 whose massns are only
      // Ansaat (typ 1), with no kontr and no beob
      const tpops =
        (await rpc<{ id: string; nr: number | null; pop_id: string }>(
          'query_tpop',
          'id,nr,pop_id',
          tpopOf({ status: { equalTo: 200 } }),
        )) ?? []
      if (!tpops.length) return popWrap([])
      // the children run through their query_ RPCs with the same tpop
      // filter — hundreds of uuids in one URL kill the connection
      // through the api proxy (#830)
      const childFilter = { tpopByTpopId: tpopOf({ status: { equalTo: 200 } }) }
      const [massns, kontrs, beobs] = await Promise.all([
        rpc<{ tpop_id: string; typ: number | null }>(
          'query_tpopmassn',
          'tpop_id,typ',
          childFilter,
        ),
        rpc<{ tpop_id: string }>('query_tpopkontr', 'tpop_id', childFilter),
        rpc<{ tpop_id: string }>('query_beob', 'tpop_id', childFilter),
      ])
      const massnTypsByTpop = new Map<string, Set<number>>()
      for (const m of massns ?? []) {
        const set = massnTypsByTpop.get(m.tpop_id) ?? new Set<number>()
        set.add(m.typ ?? -1)
        massnTypsByTpop.set(m.tpop_id, set)
      }
      const kontrTpops = new Set((kontrs ?? []).map((k) => k.tpop_id))
      const beobTpops = new Set((beobs ?? []).map((b) => b.tpop_id))
      const matching = tpops.filter((t) => {
        const typs = massnTypsByTpop.get(t.id)
        // some Ansaat (typ 1), none Anpflanzung (typ 2/3)
        const hasAnsaat = typs?.has(1) ?? false
        const hasAnpflanzung = typs?.has(2) || typs?.has(3) || false
        return (
          hasAnsaat &&
          !hasAnpflanzung &&
          !kontrTpops.has(t.id) &&
          !beobTpops.has(t.id)
        )
      })
      return tpopWrapFromRows(matching)
    },
    tpopStatusAnsaatversuchMitAnpflanzung: async () => {
      const tpops =
        (await rpc<{ id: string; nr: number | null; pop_id: string }>(
          'query_tpop',
          'id,nr,pop_id',
          tpopOf({ status: { equalTo: 201 } }),
        )) ?? []
      if (!tpops.length) return popWrap([])
      const massns =
        (await rpc<{ tpop_id: string; typ: number | null }>(
          'query_tpopmassn',
          'tpop_id,typ',
          { tpopByTpopId: tpopOf({ status: { equalTo: 201 } }) },
        )) ?? []
      const withAnpflanzung = new Set(
        massns.filter((m) => m.typ === 2 || m.typ === 3).map((m) => m.tpop_id),
      )
      return tpopWrapFromRows(tpops.filter((t) => withAnpflanzung.has(t.id)))
    },
    tpopberOhneJahr: async () =>
      tpopChildCheck('query_tpopber', { jahr: { isNull: true } }, [
        { field: 'id', dir: 'asc' },
      ]),
    tpopberOhneEntwicklung: async () =>
      tpopChildCheck('query_tpopber', { entwicklung: { isNull: true } }, [
        { field: 'jahr', dir: 'asc' },
      ]),
    tpopmassnDatum: async () =>
      tpopChildCheck(
        'query_tpopmassn',
        {
          or: [
            { jahr: { isNull: true } },
            { datum: { isNull: true } },
            { datum: { lessThan: minDatum } },
            { datum: { greaterThan: maxDatum } },
          ],
        },
        [{ field: 'id', dir: 'asc' }],
      ),
    tpopmassnOhneBearb: async () =>
      tpopChildCheck(
        'query_tpopmassn',
        { bearbeiter: { isNull: true }, jahr: { equalTo: berichtjahr } },
        [{ field: 'jahr', dir: 'asc' }],
      ),
    tpopmassnOhneTyp: async () =>
      tpopChildCheck(
        'query_tpopmassn',
        { typ: { isNull: true }, jahr: { equalTo: berichtjahr } },
        [{ field: 'jahr', dir: 'asc' }],
      ),
    tpopmassnberOhneJahr: async () =>
      tpopChildCheck('query_tpopmassnber', { jahr: { isNull: true } }, [
        { field: 'id', dir: 'asc' },
      ]),
    tpopmassnberOhneBeurteilung: async () =>
      tpopChildCheck(
        'query_tpopmassnber',
        { beurteilung: { isNull: true }, jahr: { equalTo: berichtjahr } },
        [{ field: 'jahr', dir: 'asc' }],
      ),
    tpopfeldkontrDatum: async () =>
      tpopChildCheck(
        'query_tpopkontr',
        {
          typ: { notEqualTo: 'Freiwilligen-Kontrolle' },
          or: [
            { jahr: { isNull: true } },
            { datum: { isNull: true } },
            { datum: { lessThan: minDatum } },
            { datum: { greaterThan: maxDatum } },
          ],
        },
        [{ field: 'id', dir: 'asc' }],
      ),
    tpopfreiwkontrDatum: async () =>
      tpopChildCheck(
        'query_tpopkontr',
        {
          typ: { equalTo: 'Freiwilligen-Kontrolle' },
          or: [
            { jahr: { isNull: true } },
            { datum: { isNull: true } },
            { datum: { lessThan: minDatum } },
            { datum: { greaterThan: maxDatum } },
          ],
        },
        [{ field: 'id', dir: 'asc' }],
      ),
    tpopfeldkontrOhneBearb: async () =>
      tpopChildCheck(
        'query_tpopkontr',
        {
          bearbeiter: { isNull: true },
          typ: { notEqualTo: 'Freiwilligen-Kontrolle' },
          jahr: { equalTo: berichtjahr },
        },
        [{ field: 'jahr', dir: 'asc' }],
      ),
    tpopfreiwkontrOhneBearb: async () =>
      tpopChildCheck(
        'query_tpopkontr',
        {
          bearbeiter: { isNull: true },
          typ: { equalTo: 'Freiwilligen-Kontrolle' },
          jahr: { equalTo: berichtjahr },
        },
        [{ field: 'jahr', dir: 'asc' }],
      ),
    tpopfeldkontrOhneZaehlung: async () => kontrWithoutZaehlung('notEqualTo'),
    tpopfreiwkontrOhneZaehlung: async () => kontrWithoutZaehlung('equalTo'),
    feldkontrzaehlungOhneEinheit: async () =>
      zaehlungCheck('notEqualTo', 'einheit'),
    freiwkontrzaehlungOhneEinheit: async () =>
      zaehlungCheck('equalTo', 'einheit'),
    feldkontrzaehlungOhneMethode: async () =>
      zaehlungCheck('notEqualTo', 'methode'),
    freiwkontrzaehlungOhneMethode: async () =>
      zaehlungCheck('equalTo', 'methode'),
    feldkontrzaehlungOhneAnzahl: async () =>
      zaehlungCheck('notEqualTo', 'anzahl'),
    freiwkontrzaehlungOhneAnzahl: async () =>
      zaehlungCheck('equalTo', 'anzahl'),
  }

  const active = Object.entries(activeChecks)
    .filter(([, isActive]) => isActive)
    .map(([name]) => name)
    .filter((name) => name in fetchers)
  const results = await Promise.all(
    active.map(async (name) => [name, await fetchers[name]!()]),
  )
  return Object.fromEntries(results) as QkQueryData
}
