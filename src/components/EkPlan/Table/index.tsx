// TanStack Virtual is incompatible with React Compiler memoization
'use no memo'
import { apiFetch } from '../../../modules/api.ts'

import { useState, Suspense, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useSetAtom, useAtomValue } from 'jotai'
import { useSuspenseQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button'

import type { EkPlanTpopFilter } from './tableTypes.ts'
import { CellForYearMenu } from './CellForYearMenu/index.tsx'
import { getYears } from './getYears.ts'
import { exportRowFromTpop, type ExportTpopNode } from './exportRowFromTpop.ts'
import { exportModule } from '../../../modules/export.ts'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'
import { Spinner } from '../../shared/Spinner.tsx'
import { SpinnerOverlay } from '../../shared/SpinnerOverlay.tsx'
import { Visible } from './Row/Visible.tsx'
import { EkplanTableHeader } from './Header.tsx'

import type { TpopId } from '../../../models/apflora/Tpop.ts'

import {
  addNotificationAtom,
  ekPlanApValuesAtom,
  ekPlanYearMenuAnchorAtom,
  ekPlanFilterApAtom,
  ekPlanFilterPopNrAtom,
  ekPlanFilterPopNameAtom,
  ekPlanFilterPopStatusAtom,
  ekPlanFilterNrAtom,
  ekPlanFilterGemeindeAtom,
  ekPlanFilterFlurnameAtom,
  ekPlanFilterStatusAtom,
  ekPlanFilterBekanntSeitAtom,
  ekPlanFilterLv95XAtom,
  ekPlanFilterLv95YAtom,
  ekPlanFilterEkfKontrolleurAtom,
  ekPlanFilterEkfrequenzAbweichendAtom,
  ekPlanFilterEkAbrechnungstypAtom,
  ekPlanFilterEkfrequenzAtom,
  ekPlanFilterEkfrequenzStartjahrAtom,
  ekPlanFilterEkfrequenzEmptyAtom,
  ekPlanFilterEkfrequenzStartjahrEmptyAtom,
  ekPlanFilterAnsiedlungYearAtom,
  ekPlanFilterKontrolleYearAtom,
  ekPlanFilterEkplanYearAtom,
  ekPlanPastYearsAtom,
} from '../../../store/index.ts'

import styles from './index.module.css'

interface PopFilter {
  apId: { in: string[] }
  nr?: { equalTo: number }
  name?: { includesInsensitive: string }
  popStatusWerteByStatus?: { code: { in: number[] } }
}

const getTpopFilter = ({
  apValues,
  filterAp,
  filterPopNr,
  filterPopName,
  filterPopStatus,
  filterNr,
  filterGemeinde,
  filterFlurname,
  filterStatus,
  filterBekanntSeit,
  filterLv95X,
  filterLv95Y,
  filterEkfKontrolleur,
  filterEkfrequenzAbweichend,
  filterEkAbrechnungstyp,
  filterEkfrequenz,
  filterEkfrequenzStartjahr,
  filterEkfrequenzEmpty,
  filterEkfrequenzStartjahrEmpty,
  filterAnsiedlungYear,
  filterKontrolleYear,
  filterEkplanYear,
}: {
  apValues: string[]
  filterAp: string | null
  filterPopNr: number | null
  filterPopName: string | null
  filterPopStatus: number[] | null
  filterNr: number | null
  filterGemeinde: string | null
  filterFlurname: string | null
  filterStatus: number[] | null
  filterBekanntSeit: number | null
  filterLv95X: number | null
  filterLv95Y: number | null
  filterEkfKontrolleur: string | null
  filterEkfrequenzAbweichend: boolean
  filterEkAbrechnungstyp: string | null
  filterEkfrequenz: string | null
  filterEkfrequenzStartjahr: number | null
  filterEkfrequenzEmpty: boolean
  filterEkfrequenzStartjahrEmpty: boolean
  filterAnsiedlungYear: number | null
  filterKontrolleYear: number | null
  filterEkplanYear: number | null
}): EkPlanTpopFilter => {
  const popFilter: PopFilter = {
    apId: { in: apValues },
  }
  const tpopFilter: EkPlanTpopFilter = {
    popByPopId: popFilter,
  }
  if (filterAp) {
    tpopFilter.apName = { includesInsensitive: filterAp }
  }
  if (filterPopNr) {
    popFilter.nr = { equalTo: filterPopNr }
  }
  if (filterPopName) {
    popFilter.name = { includesInsensitive: filterPopName }
  }
  if (filterPopStatus) {
    popFilter.popStatusWerteByStatus = {
      code: {
        in: filterPopStatus,
      },
    }
  }
  if (filterNr) {
    tpopFilter.nr = { equalTo: filterNr }
  }
  if (filterGemeinde) {
    tpopFilter.gemeinde = { includesInsensitive: filterGemeinde }
  }
  if (filterFlurname) {
    tpopFilter.flurname = { includesInsensitive: filterFlurname }
  }
  if (filterStatus?.length) {
    tpopFilter.popStatusWerteByStatus = {
      code: {
        in: filterStatus,
      },
    }
  }
  if (filterBekanntSeit) {
    tpopFilter.bekanntSeit = { equalTo: filterBekanntSeit }
  }
  if (filterLv95X) {
    tpopFilter.lv95X = { equalTo: filterLv95X }
  }
  if (filterLv95Y) {
    tpopFilter.lv95Y = { equalTo: filterLv95Y }
  }
  if (filterEkfKontrolleur) {
    tpopFilter.adresseByEkfKontrolleur = {
      name: { includesInsensitive: filterEkfKontrolleur },
    }
  }
  if (filterEkfrequenzAbweichend) {
    tpopFilter.ekfrequenzAbweichend = {
      equalTo: filterEkfrequenzAbweichend,
    }
  }
  if (filterEkAbrechnungstyp) {
    tpopFilter.ekfrequenzByEkfrequenz = {
      ekAbrechnungstyp: {
        includesInsensitive: filterEkAbrechnungstyp,
      },
    }
  }
  if (filterEkfrequenz) {
    tpopFilter.ekfrequenzByEkfrequenz = {
      code: {
        includesInsensitive: filterEkfrequenz,
      },
    }
  }
  if (filterEkfrequenzStartjahr) {
    tpopFilter.ekfrequenzStartjahr = { equalTo: filterEkfrequenzStartjahr }
  }
  if (filterEkfrequenzEmpty) {
    tpopFilter.ekfrequenz = { isNull: true }
  }
  if (filterEkfrequenzStartjahrEmpty) {
    tpopFilter.ekfrequenzStartjahr = { isNull: true }
  }
  if (filterKontrolleYear) {
    tpopFilter.tpopkontrsByTpopId = {
      some: { jahr: { equalTo: filterKontrolleYear } },
    }
  }
  if (filterAnsiedlungYear) {
    tpopFilter.tpopmassnsByTpopId = {
      some: {
        jahr: { equalTo: filterAnsiedlungYear },
        tpopmassnTypWerteByTyp: { ansiedlung: { equalTo: true } },
      },
    }
  }
  if (filterEkplanYear) {
    tpopFilter.ekplansByTpopId = {
      some: { jahr: { equalTo: filterEkplanYear } },
    }
  }
  return tpopFilter
}

export const EkPlanTable = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apValues = useAtomValue(ekPlanApValuesAtom)
  const yearMenuAnchor = useAtomValue(ekPlanYearMenuAnchorAtom)
  const filterAp = useAtomValue(ekPlanFilterApAtom)
  const filterPopNr = useAtomValue(ekPlanFilterPopNrAtom)
  const filterPopName = useAtomValue(ekPlanFilterPopNameAtom)
  const filterPopStatus = useAtomValue(ekPlanFilterPopStatusAtom)
  const filterNr = useAtomValue(ekPlanFilterNrAtom)
  const filterGemeinde = useAtomValue(ekPlanFilterGemeindeAtom)
  const filterFlurname = useAtomValue(ekPlanFilterFlurnameAtom)
  const filterStatus = useAtomValue(ekPlanFilterStatusAtom)
  const filterBekanntSeit = useAtomValue(ekPlanFilterBekanntSeitAtom)
  const filterLv95X = useAtomValue(ekPlanFilterLv95XAtom)
  const filterLv95Y = useAtomValue(ekPlanFilterLv95YAtom)
  const filterEkfKontrolleur = useAtomValue(ekPlanFilterEkfKontrolleurAtom)
  const filterEkfrequenzAbweichend = useAtomValue(
    ekPlanFilterEkfrequenzAbweichendAtom,
  )
  const filterEkAbrechnungstyp = useAtomValue(ekPlanFilterEkAbrechnungstypAtom)
  const filterEkfrequenz = useAtomValue(ekPlanFilterEkfrequenzAtom)
  const filterEkfrequenzStartjahr = useAtomValue(
    ekPlanFilterEkfrequenzStartjahrAtom,
  )
  const filterEkfrequenzEmpty = useAtomValue(ekPlanFilterEkfrequenzEmptyAtom)
  const filterEkfrequenzStartjahrEmpty = useAtomValue(
    ekPlanFilterEkfrequenzStartjahrEmptyAtom,
  )
  const filterAnsiedlungYear = useAtomValue(ekPlanFilterAnsiedlungYearAtom)
  const filterKontrolleYear = useAtomValue(ekPlanFilterKontrolleYearAtom)
  const filterEkplanYear = useAtomValue(ekPlanFilterEkplanYearAtom)
  const pastYears = useAtomValue(ekPlanPastYearsAtom)

  const [processing, setProcessing] = useState(false)

  interface TpopNode {
    id: TpopId
  }

  interface EkplanTpopQueryResult {
    allTpops: {
      nodes: TpopNode[]
    }
  }

  const tpopFilter = getTpopFilter({
    apValues,
    filterAp,
    filterPopNr,
    filterPopName,
    filterPopStatus,
    filterNr,
    filterGemeinde,
    filterFlurname,
    filterStatus,
    filterBekanntSeit,
    filterLv95X,
    filterLv95Y,
    filterEkfKontrolleur,
    filterEkfrequenzAbweichend,
    filterEkAbrechnungstyp,
    filterEkfrequenz,
    filterEkfrequenzStartjahr,
    filterEkfrequenzEmpty,
    filterEkfrequenzStartjahrEmpty,
    filterAnsiedlungYear,
    filterKontrolleYear,
    filterEkplanYear,
  })

  const { data, refetch } = useSuspenseQuery({
    queryKey: ['EkplanTpopQuery', tpopFilter],
    queryFn: async () => {
      // phase 5: the former AP_NAME/POP_NR/NR ordering happens client-side
      // via the pop/ap context that the row fetches anyway
      const nodes =
        (await apiFetch<{ id: string }[]>('/rpc/query_tpop?select=id', {
          method: 'POST',
          body: JSON.stringify({ p_filter: tpopFilter }),
        })) ?? []
      return { allTpops: { nodes } } as unknown as EkplanTpopQueryResult
    },
  })

  const tpops = (data.allTpops?.nodes ?? []) as TpopNode[]
  const years = getYears(pastYears)

  const onClickExport = async () => {
    // phase 5: the nested export document became REST calls + client joins
    let tpops: ExportTpopNode[]
    let ekfrequenzs: { id: string; code: string | null }[] = []
    try {
      const [tpopRows, ekfrequenzRows, popsR, apsR, statusWerteR, adressenR] =
        await Promise.all([
          // ekplan has no query_ RPC — its rows come embedded, keeping
          // every tpop id out of the URL (a ~30 kB URL kills the
          // connection on production, #830)
          apiFetch<
            Record<string, unknown> & {
              id: string
              ekplan: { jahr: number | null; typ: string | null }[]
            }[]
          >('/rpc/query_tpop?select=*,ekplan(jahr,typ)', {
            method: 'POST',
            body: JSON.stringify({ p_filter: tpopFilter }),
          }),
          apiFetch<{ id: string; code: string | null }[]>(
            `/q_ekfrequenz?${apValues.length ? `ap_id=in.(${apValues.join(',')})&` : ''}select=id,code&order=sort.asc`,
          ),
          apiFetch('/q_pop?select=id,nr,name,status,ap_id'),
          apiFetch('/v_ap?select=id,label,proj_id'),
          apiFetch('/pop_status_werte?select=code,text'),
          apiFetch('/v_adresse?select=id,name'),
        ])
      const tpopIds = ((tpopRows ?? []) as { id: string }[]).map((t) => t.id)
      const [kontrsR, massnsR, massnTypWerteR] =
        tpopIds.length ?
          await Promise.all([
            apiFetch<{ id: string; tpop_id: string; jahr: number | null }[]>(
              '/rpc/query_tpopkontr?select=id,tpop_id,jahr',
              {
                method: 'POST',
                body: JSON.stringify({
                  p_filter: { tpopByTpopId: { id: { in: tpopIds } } },
                }),
              },
            ),
            apiFetch(
              '/rpc/query_tpopmassn?select=id,tpop_id,jahr,typ,zieleinheit_anzahl',
              {
                method: 'POST',
                body: JSON.stringify({
                  p_filter: { tpopByTpopId: { id: { in: tpopIds } } },
                }),
              },
            ),
            apiFetch<
              {
                code: number
                text: string | null
                ansiedlung: boolean | null
              }[]
            >('/tpopmassn_typ_werte?select=code,text,ansiedlung'),
          ])
        : [[], [], []]
      const popsById = new Map(
        ((popsR ?? []) as { id: string }[]).map((p) => [p.id, p]),
      )
      const apsById = new Map(
        ((apsR ?? []) as { id: string }[]).map((a) => [a.id, a]),
      )
      const statusText = new Map(
        ((statusWerteR ?? []) as { code: number; text: string | null }[]).map(
          (w) => [w.code, w.text ?? ''],
        ),
      )
      const adressenById = new Map(
        ((adressenR ?? []) as { id: string; name: string | null }[]).map(
          (a) => [a.id, a.name],
        ),
      )
      const ansiedlungTypes = new Set(
        (
          (massnTypWerteR ?? []) as {
            ansiedlung: boolean | null
            code: number
          }[]
        )
          .filter((w) => w.ansiedlung === true)
          .map((w) => w.code),
      )
      const ekplansByTpop = new Map<
        string,
        { jahr: number | null; typ: string | null }[]
      >()
      for (const t of tpopRows ?? []) {
        // ek_type enum labels arrive lowercase; the export compares
        // the uppercased graphql values
        ekplansByTpop.set(
          t.id,
          (t.ekplan ?? []).map((e) => ({
            jahr: e.jahr,
            typ: e.typ?.toUpperCase() ?? null,
          })),
        )
      }
      const kontrsByTpop = new Map<string, unknown[]>()
      for (const k of (kontrsR ?? []) as { tpop_id: string }[]) {
        const list = kontrsByTpop.get(k.tpop_id) ?? []
        list.push(k)
        kontrsByTpop.set(k.tpop_id, list)
      }
      const massnsByTpop = new Map<string, unknown[]>()
      for (const m of (massnsR ?? []) as {
        tpop_id: string
        typ: number | null
      }[]) {
        if (m.typ == null || !ansiedlungTypes.has(m.typ)) continue
        const list = massnsByTpop.get(m.tpop_id) ?? []
        list.push(m)
        massnsByTpop.set(m.tpop_id, list)
      }
      ekfrequenzs = (ekfrequenzRows ?? []) as {
        id: string
        code: string | null
      }[]
      tpops = ((tpopRows ?? []) as Record<string, unknown>[]).map((t) => {
        const tpopId = t.pop_id ? (t.id as string) : (t.id as string)
        const pop = popsById.get(t.pop_id as string) as
          | {
              id: string
              nr: number | null
              name: string | null
              status: number | null
              ap_id: string | null
            }
          | undefined
        const apBy =
          pop?.ap_id ?
            (apsById.get(pop.ap_id) as
              | { id: string; label: string | null; proj_id: string | null }
              | undefined)
          : undefined
        return {
          id: tpopId,
          nr: t.nr as number | null,
          gemeinde: t.gemeinde as string | null,
          flurname: t.flurname as string | null,
          lv95X: t.lv95_x as number | null,
          lv95Y: t.lv95_y as number | null,
          ekfrequenz: t.ekfrequenz as string | null,
          ekfrequenzStartjahr: t.ekfrequenz_startjahr as number | null,
          ekfrequenzAbweichend: t.ekfrequenz_abweichend as boolean | null,
          bekanntSeit: t.bekannt_seit as number | null,
          ekfrequenzByEkfrequenz: null,
          popStatusWerteByStatus:
            t.status == null ?
              null
            : {
                text: statusText.get(t.status as number) ?? null,
              },
          adresseByEkfKontrolleur:
            t.ekf_kontrolleur == null ?
              null
            : {
                name: adressenById.get(t.ekf_kontrolleur as string) ?? null,
              },
          popByPopId:
            pop ?
              {
                id: pop.id,
                nr: pop.nr,
                name: pop.name,
                popStatusWerteByStatus:
                  pop.status == null ?
                    null
                  : {
                      text: statusText.get(pop.status) ?? null,
                    },
                apByApId:
                  apBy ?
                    { id: apBy.id, projId: apBy.proj_id, label: apBy.label }
                  : null,
              }
            : null,
          ekplansByTpopId: { nodes: ekplansByTpop.get(tpopId) ?? [] },
          tpopkontrsByTpopId: { nodes: kontrsByTpop.get(tpopId) ?? [] },
          tpopmassnsByTpopId: { nodes: massnsByTpop.get(tpopId) ?? [] },
        } as ExportTpopNode
      })
    } catch (error) {
      return addNotification({
        message: `Fehler beim Abfragen für den Export: ${(error as Error).message}`,
        options: {
          variant: 'error',
        },
      })
    }
    const data = tpops.map((tpop) =>
      exportRowFromTpop({ tpop, years, ekfrequenzs }),
    )
    void exportModule({ data, fileName: 'ek-planung' })
  }

  // TODO: give button to remove all filters in case something goes wrong

  return (
    <ErrorBoundary>
      {processing && (
        <SpinnerOverlay message="Startjahr und EK-Pläne werden gesetzt" />
      )}
      <Suspense fallback={<Spinner />}>
        <Button
          variant="outlined"
          onClick={() => void onClickExport()}
          color="inherit"
          className={styles.exportButton}
        >
          exportieren
        </Button>
        <div className={styles.container}>
          <EkPlanTableBody
            tpops={tpops}
            setProcessing={setProcessing}
            years={years}
            header={
              <EkplanTableHeader
                tpopLength={tpops.length !== 0 ? tpops.length : '...'}
                tpopFilter={tpopFilter}
                refetch={() => void refetch()}
                years={years}
              />
            }
          />
        </div>
      </Suspense>
      {!!yearMenuAnchor && <CellForYearMenu />}
    </ErrorBoundary>
  )
}

/**
 * Owns the virtualized rows. Kept out of EkPlanTable because that
 * component suspends on its query before first commit, which breaks
 * the virtualizer's mount cycle. This component only mounts once the
 * data has resolved.
 */
const EkPlanTableBody = ({
  tpops,
  setProcessing,
  years,
  header,
}: {
  tpops: { id: TpopId }[]
  setProcessing: (processing: boolean) => void
  years: number[]
  header: React.ReactNode
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: tpops.length,
    // rows have a fixed 60px height (Row css)
    estimateSize: () => 60,
    getItemKey: (index) => tpops[index]?.id ?? index,
    getScrollElement: () => scrollContainerRef.current,
    overscan: 10,
  })

  return (
    <div
      className={styles.scrollContainer}
      ref={scrollContainerRef}
    >
      {header}
      <div
        className={styles.rows}
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const tpop = tpops[virtualRow.index]
          if (!tpop) return null

          return (
            <div
              key={virtualRow.key}
              className={styles.row}
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <Visible
                tpopId={tpop.id}
                index={virtualRow.index}
                setProcessing={setProcessing}
                years={years}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
