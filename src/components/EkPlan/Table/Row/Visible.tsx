import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { apiFetch } from '../../../../modules/api.ts'

import { CellForYearTitle } from '../CellForYearTitle.tsx'
import { CellForEkfrequenz } from '../CellForEkfrequenz/index.tsx'
import { CellForEkfrequenzStartjahr } from '../CellForEkfrequenzStartjahr/index.tsx'
import { CellForEkfrequenzAbweichend } from '../CellForEkfrequenzAbweichend/index.tsx'
import { CellForTpopLink } from '../CellForTpopLink.tsx'
import { CellForValue } from '../CellForValue.tsx'
import { CellForYear } from '../CellForYear/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { tpopRowFromTpop } from './tpopRowFromTpop.ts'
import type {
  RowEkfrequenzNode,
  RowQueryForEkPlanResult,
} from '../tableTypes.ts'
import {
  ekPlanFieldsAtom,
  ekPlanApValuesAtom,
} from '../../../../store/index.ts'

const isItOdd = (num: number) => num % 2 === 0

export const Visible = ({
  tpopId,
  index,
  setProcessing,
  years,
}: {
  tpopId: string
  index: number
  setProcessing: (processing: boolean) => void
  years: number[]
}) => {
  const fieldsShown = useAtomValue(ekPlanFieldsAtom)
  const apValues = useAtomValue(ekPlanApValuesAtom)
  const isOdd = isItOdd(index)

  // pop/ap/adresse/status context is identical for every row - fetched
  // once per apValues instead of per row (the phase 5 migration had
  // dropped it entirely, leaving the Art column and pop fields empty)
  const { data: context } = useQuery({
    queryKey: ['EkPlanContext', apValues],
    enabled: apValues.length > 0,
    queryFn: async () => {
      const [apsR, popsR, statusWerteR, adressenR] = await Promise.all([
        apiFetch<{ id: string; label: string | null; proj_id: string | null }[]>(
          `/v_ap?id=in.(${apValues.join(',')})&select=id,label,proj_id`,
        ),
        apiFetch<
          {
            id: string
            nr: number | null
            name: string | null
            status: number | null
            ap_id: string | null
          }[]
        >(
          `/q_pop?ap_id=in.(${apValues.join(',')})&select=id,nr,name,status,ap_id`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          '/pop_status_werte?select=code,text',
        ),
        apiFetch<{ id: string; name: string | null }[]>(
          '/v_adresse?select=id,name',
        ),
      ])
      return {
        apsById: new Map((apsR ?? []).map((a) => [a.id, a])),
        popsById: new Map((popsR ?? []).map((p) => [p.id, p])),
        statusText: new Map(
          (statusWerteR ?? []).map((w) => [w.code, w.text ?? '']),
        ),
        adressenById: new Map((adressenR ?? []).map((a) => [a.id, a.name])),
      }
    },
  })

  const { data, error } = useQuery({
    queryKey: ['RowQueryForEkPlan', apValues, tpopId, years, fieldsShown],
    queryFn: async (): Promise<RowQueryForEkPlanResult> => {
      // phase 5: the @include-driven row document became REST calls with
      // client-side joins; years filter applies via compile_filter's in-list
      const yearIn = { jahr: { in: years } }
      const [
        ekfrequenzsR,
        tpopR,
        ekplansR,
        kontrsR,
        massnsR,
        ekAbrechnungstypWerteR,
      ] = await Promise.all([
        apiFetch(
          `/q_ekfrequenz?${apValues.length ? `ap_id=in.(${apValues.join(',')})&` : ''}select=id,code,anwendungsfall,ek_abrechnungstyp&order=sort.asc`,
        ),
        apiFetch(
          `/q_tpop?id=eq.${tpopId}&select=id,nr,gemeinde,flurname,lv95_x,lv95_y,ekfrequenz,ekfrequenz_startjahr,ekfrequenz_abweichend,status,bekannt_seit,ekf_kontrolleur,pop_id`,
        ),
        apiFetch(
          `/ekplan?tpop_id=eq.${tpopId}&jahr=in.(${years.join(',')})&select=jahr,typ&order=jahr.asc`,
        ),
        apiFetch('/rpc/query_tpopkontr?select=id,jahr,typ', {
          method: 'POST',
          body: JSON.stringify({
            p_filter: {
              tpopByTpopId: { id: { equalTo: tpopId } },
              ...yearIn,
            },
          }),
        }),
        apiFetch('/rpc/query_tpopmassn?select=id,jahr,zieleinheit_anzahl,typ', {
          method: 'POST',
          body: JSON.stringify({
            p_filter: {
              tpopByTpopId: { id: { equalTo: tpopId } },
              ...yearIn,
            },
          }),
        }),
        apiFetch<{ code: string; text: string | null }[]>(
          '/ek_abrechnungstyp_werte?select=code,text',
        ),
      ])
      // ansiedlung-only massn types
      const massnTypWerte =
        (await apiFetch<
          { code: number; text: string | null; ansiedlung: boolean | null }[]
        >('/tpopmassn_typ_werte?select=code,text,ansiedlung')) ?? []
      const ansiedlungTypes = new Set(
        massnTypWerte.filter((w) => w.ansiedlung === true).map((w) => w.code),
      )
      const ekAbrechnungstypWerte = new Map(
        (ekAbrechnungstypWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      const ekfrequenzNodes = (
        (ekfrequenzsR ?? []) as {
          id: string
          code: string | null
          anwendungsfall: string | null
          ek_abrechnungstyp: string | null
        }[]
      ).map((e) => ({
        id: e.id,
        code: e.code,
        anwendungsfall: e.anwendungsfall,
        ekAbrechnungstyp: e.ek_abrechnungstyp,
        ekAbrechnungstypWerteByEkAbrechnungstyp:
          e.ek_abrechnungstyp ?
            {
              id: e.ek_abrechnungstyp,
              text: ekAbrechnungstypWerte.get(e.ek_abrechnungstyp) ?? null,
            }
          : null,
      })) as RowEkfrequenzNode[]
      const tpop = ((tpopR ?? []) as Record<string, unknown>[])[0]
      if (!tpop) {
        return { allEkfrequenzs: { nodes: ekfrequenzNodes }, tpopById: null }
      }
      // kontrollen with their zaehlungen + zielrelevant flag
      const kontrRows = (kontrsR ?? []) as {
        id: string
        jahr: number | null
        typ: string | null
      }[]
      const kontrIds = kontrRows.map((k) => k.id)
      const zaehls =
        kontrIds.length ?
          ((await apiFetch<
            {
              id: string
              tpopkontr_id: string
              einheit: number | null
              anzahl: number | null
            }[]
          >(
            `/q_tpopkontrzaehl?tpopkontr_id=in.(${kontrIds.join(',')})&select=id,tpopkontr_id,einheit,anzahl`,
          )) ?? [])
        : []
      const zielrelevantEinheiten =
        (await apiFetch<{ zaehleinheit_id: number }[]>(
          '/ekzaehleinheit?zielrelevant=eq.true&select=zaehleinheit_id:zaehleinheit_id',
        )) ?? []
      const zielrelevantSet = new Set(
        zielrelevantEinheiten.map((z) => z.zaehleinheit_id),
      )
      const zaehlsByKontr = new Map<string, typeof zaehls>()
      for (const z of zaehls) {
        const list = zaehlsByKontr.get(z.tpopkontr_id) ?? []
        list.push(z)
        zaehlsByKontr.set(z.tpopkontr_id, list)
      }
      const mapKontr = (k: (typeof kontrRows)[number]) => ({
        id: k.id,
        jahr: k.jahr,
        tpopkontrzaehlsByTpopkontrId: {
          nodes: (zaehlsByKontr.get(k.id) ?? []).map((z) => ({
            id: z.id,
            einheit: z.einheit,
            anzahl: z.anzahl,
            tpopkontrzaehlEinheitWerteByEinheit:
              z.einheit == null ?
                null
              : {
                  id: z.einheit,
                  ekzaehleinheitsByZaehleinheitId: {
                    totalCount: zielrelevantSet.has(z.einheit) ? 1 : 0,
                  },
                },
          })),
        },
      })
      // ek_type enum: PostgREST returns lowercase labels, graphql returned
      // the uppercased values the consumers compare against
      const ekplanRows = ((ekplansR ?? []) as {
        jahr: number | null
        typ: string | null
      }[]).map((e) => ({ jahr: e.jahr, typ: e.typ?.toUpperCase() ?? null }))
      return {
        allEkfrequenzs: { nodes: ekfrequenzNodes },
        tpopById: {
          ...tpop,
          lv95X: tpop.lv95_x,
          lv95Y: tpop.lv95_y,
          ekfrequenzStartjahr: tpop.ekfrequenz_startjahr,
          ekfrequenzAbweichend: tpop.ekfrequenz_abweichend,
          bekanntSeit: tpop.bekannt_seit,
          popStatusWerteByStatus: null,
          adresseByEkfKontrolleur: null,
          ekfrequenzByEkfrequenz: null,
          popByPopId: null,
          ekPlans: {
            nodes: ekplanRows
              .filter((e) => e.typ === 'EK')
              .map((e) => ({ jahr: e.jahr })),
          },
          ekfPlans: {
            nodes: ekplanRows
              .filter((e) => e.typ === 'EKF')
              .map((e) => ({ jahr: e.jahr })),
          },
          eks: {
            nodes: kontrRows
              .filter((k) => k.typ !== 'Freiwilligen-Kontrolle')
              .map(mapKontr),
          },
          ekfs: {
            nodes: kontrRows
              .filter((k) => k.typ === 'Freiwilligen-Kontrolle')
              .map(mapKontr),
          },
          ansiedlungs: {
            nodes: (
              (massnsR ?? []) as {
                id: string
                jahr: number | null
                zieleinheit_anzahl: number | null
                typ: number | null
              }[]
            )
              .filter((m) => m.typ != null && ansiedlungTypes.has(m.typ))
              .map((m) => ({
                id: m.id,
                jahr: m.jahr,
                zieleinheitAnzahl: m.zieleinheit_anzahl,
              })),
          },
        },
      } as unknown as RowQueryForEkPlanResult
    },
  })

  const tpopRaw = data?.tpopById as
    | (Record<string, unknown> & { id: string })
    | undefined
  const pop = tpopRaw?.pop_id ?
    context?.popsById.get(tpopRaw.pop_id as string)
  : undefined
  const ap = pop?.ap_id ? context?.apsById.get(pop.ap_id) : undefined
  const tpop =
    tpopRaw ?
      ({
        ...tpopRaw,
        popStatusWerteByStatus:
          tpopRaw.status == null ?
            null
          : {
              text:
                context?.statusText.get(tpopRaw.status as number) ?? null,
            },
        adresseByEkfKontrolleur:
          tpopRaw.ekf_kontrolleur == null ?
            null
          : {
              name:
                context?.adressenById.get(
                  tpopRaw.ekf_kontrolleur as string,
                ) ?? null,
            },
        ekfrequenzByEkfrequenz:
          (data?.allEkfrequenzs?.nodes ?? []).find(
            (e) => e.id === tpopRaw.ekfrequenz,
          ) ?? null,
        popByPopId:
          pop ?
            {
              id: pop.id,
              nr: pop.nr,
              name: pop.name,
              popStatusWerteByStatus:
                pop.status == null ?
                  null
                : { text: context?.statusText.get(pop.status) ?? null },
              apByApId:
                ap ?
                  { id: ap.id, projId: ap.proj_id, label: ap.label }
                : null,
            }
          : null,
      } as RowQueryForEkPlanResult['tpopById'])
    : null
  const ekfrequenz = tpop?.ekfrequenz
  const ekfrequenzStartjahr = tpop?.ekfrequenzStartjahr
  const ekfrequenzAbweichend = tpop?.ekfrequenzAbweichend

  const row = tpopRowFromTpop(tpop)
  const tpopColumns = (Object.values(row) as Record<string, unknown>[])
    .filter((o) => typeof o === 'object')
    .filter((o) => !!o.name)
    .filter((o) => fieldsShown.includes(o.name as string) || !!o.alwaysShow)

  if (error) return `Fehler: ${(error as Error).message}`

  return (
    <ErrorBoundary>
      {tpopColumns.map((tpopColumn, columnIndex) => {
        const value = row[tpopColumn.name as string] as Record<string, unknown>
        const width = tpopColumn.width as number

        if (value.name === 'yearTitle') {
          return (
            <CellForYearTitle
              key={value.name}
              row={row}
              isOdd={isOdd}
            />
          )
        }
        if (value.name === 'ekAbrechnungstyp') {
          return (
            <CellForValue
              key={value.name}
              field={value}
              row={row}
              isOdd={isOdd}
              firstChild={columnIndex === 0}
              width={width}
            />
          )
        }
        if (value.name === 'ekfrequenz') {
          return (
            <CellForEkfrequenz
              key={value.name}
              row={row}
              isOdd={isOdd}
              data={data}
              field={value}
              setProcessing={setProcessing}
              width={width}
            />
          )
        }
        if (value.name === 'ekfrequenzStartjahr') {
          return (
            <CellForEkfrequenzStartjahr
              key={value.name}
              row={row}
              isOdd={isOdd}
              ekfrequenzStartjahr={ekfrequenzStartjahr}
              ekfrequenz={ekfrequenz}
              setProcessing={setProcessing}
              width={width}
            />
          )
        }
        if (value.name === 'ekfrequenzAbweichend') {
          return (
            <CellForEkfrequenzAbweichend
              key={value.name}
              row={row}
              isOdd={isOdd}
              ekfrequenzAbweichend={ekfrequenzAbweichend}
              width={width}
            />
          )
        }
        if (value.name === 'link') {
          return (
            <CellForTpopLink
              key={value.name}
              field={value}
              row={row}
              isOdd={isOdd}
              width={width}
            />
          )
        }
        return (
          <CellForValue
            key={String(value.label)}
            field={value}
            row={row}
            isOdd={isOdd}
            firstChild={columnIndex === 0}
            width={width}
          />
        )
      })}
      {years.map((year: number) => {
        // TODO: query view/function to get these values without having to filter here?
        const ekPlan =
          (tpop?.ekPlans?.nodes ?? []).filter((n) => n.jahr === year).length > 0
        const ekfPlan =
          (tpop?.ekfPlans?.nodes ?? []).filter((n) => n.jahr === year).length >
          0
        const eks = (tpop?.eks?.nodes ?? []).filter((n) => n.jahr === year)
        const ekfs = (tpop?.ekfs?.nodes ?? []).filter((n) => n.jahr === year)
        const ansiedlungs = (tpop?.ansiedlungs?.nodes ?? []).filter(
          (n) => n.jahr === year,
        )

        return (
          <CellForYear
            key={year}
            row={row}
            isOdd={isOdd}
            year={year}
            ekPlan={ekPlan}
            ekfPlan={ekfPlan}
            eks={eks}
            ekfs={ekfs}
            ansiedlungs={ansiedlungs}
          />
        )
      })}
    </ErrorBoundary>
  )
}
