import { lazy, Suspense, useEffect } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import Button from '@mui/material/Button'

import type { ApId } from '../../models/apflora/Ap.ts'
import type { EkzaehleinheitId } from '../../models/apflora/Ekzaehleinheit.ts'
import type { TpopkontrzaehlEinheitWerteId } from '../../models/apflora/TpopkontrzaehlEinheitWerte.ts'

const ApList = lazy(async () => ({
  default: (await import('./ApList/index.tsx')).ApList,
}))
const Table = lazy(async () => ({
  default: (await import('./Table/index.tsx')).EkPlanTable,
}))
const Choose = lazy(async () => ({
  default: (await import('./Choose.tsx')).Choose,
}))
import { apiFetch } from '../../modules/api.ts'
import { appBaseUrl } from '../../modules/appBaseUrl.ts'
import {
  type EkPlanApsData,
  userTokenAtom,
  ekPlanApsAtom,
  ekPlanApsDataAtom,
  ekPlanApsDataLoadingAtom,
  ekPlanSetFilterApAtom,
  ekPlanSetFilterPopNrAtom,
  ekPlanSetFilterPopNameAtom,
  ekPlanSetFilterPopStatusAtom,
  ekPlanSetFilterNrAtom,
  ekPlanSetFilterGemeindeAtom,
  ekPlanSetFilterFlurnameAtom,
  ekPlanSetFilterStatusAtom,
  ekPlanSetFilterBekanntSeitAtom,
  ekPlanSetFilterLv95XAtom,
  ekPlanSetFilterLv95YAtom,
  ekPlanSetFilterEkfKontrolleurAtom,
  ekPlanSetFilterEkfrequenzAbweichendAtom,
  ekPlanSetFilterEkAbrechnungstypAtom,
  ekPlanSetFilterEkfrequenzAtom,
  ekPlanSetFilterEkfrequenzStartjahrAtom,
  ekPlanSetFilterAnsiedlungYearAtom,
  ekPlanSetFilterKontrolleYearAtom,
  ekPlanSetFilterEkplanYearAtom,
} from '../../store/index.ts'
const ErrorBoundary = lazy(async () => ({
  default: (await import('../shared/ErrorBoundary.tsx')).ErrorBoundary,
}))
const User = lazy(async () => ({ default: (await import('../User.tsx')).User }))
const Spinner = lazy(async () => ({
  default: (await import('../shared/Spinner.tsx')).Spinner,
}))

import styles from './index.module.css'

export const Component = () => {
  const userToken = useAtomValue(userTokenAtom)
  const aps = useAtomValue(ekPlanApsAtom)
  const setApsData = useSetAtom(ekPlanApsDataAtom)
  const setApsDataLoading = useSetAtom(ekPlanApsDataLoadingAtom)
  const setFilterAp = useSetAtom(ekPlanSetFilterApAtom)
  const setFilterPopNr = useSetAtom(ekPlanSetFilterPopNrAtom)
  const setFilterPopName = useSetAtom(ekPlanSetFilterPopNameAtom)
  const setFilterPopStatus = useSetAtom(ekPlanSetFilterPopStatusAtom)
  const setFilterNr = useSetAtom(ekPlanSetFilterNrAtom)
  const setFilterGemeinde = useSetAtom(ekPlanSetFilterGemeindeAtom)
  const setFilterFlurname = useSetAtom(ekPlanSetFilterFlurnameAtom)
  const setFilterStatus = useSetAtom(ekPlanSetFilterStatusAtom)
  const setFilterBekanntSeit = useSetAtom(ekPlanSetFilterBekanntSeitAtom)
  const setFilterLv95X = useSetAtom(ekPlanSetFilterLv95XAtom)
  const setFilterLv95Y = useSetAtom(ekPlanSetFilterLv95YAtom)
  const setFilterEkfKontrolleur = useSetAtom(ekPlanSetFilterEkfKontrolleurAtom)
  const setFilterEkfrequenzAbweichend = useSetAtom(
    ekPlanSetFilterEkfrequenzAbweichendAtom,
  )
  const setFilterEkAbrechnungstyp = useSetAtom(
    ekPlanSetFilterEkAbrechnungstypAtom,
  )
  const setFilterEkfrequenz = useSetAtom(ekPlanSetFilterEkfrequenzAtom)
  const setFilterEkfrequenzStartjahr = useSetAtom(
    ekPlanSetFilterEkfrequenzStartjahrAtom,
  )
  const setFilterAnsiedlungYear = useSetAtom(ekPlanSetFilterAnsiedlungYearAtom)
  const setFilterKontrolleYear = useSetAtom(ekPlanSetFilterKontrolleYearAtom)
  const setFilterEkplanYear = useSetAtom(ekPlanSetFilterEkplanYearAtom)

  interface TpopkontrzaehlEinheitWerteNode {
    id: TpopkontrzaehlEinheitWerteId
    code: string | null
    text: string | null
  }

  interface EkzaehleinheitNode {
    id: EkzaehleinheitId
    tpopkontrzaehlEinheitWerteByZaehleinheitId: TpopkontrzaehlEinheitWerteNode | null
  }

  interface ApNode {
    id: ApId
    ekzaehleinheitsByApId: {
      nodes: EkzaehleinheitNode[]
    }
  }

  interface EkplanApQueryResult {
    allAps: {
      nodes: ApNode[]
    }
  }

  const { data } = useSuspenseQuery({
    queryKey: ['ekplanAps', aps.map((ap) => ap.value)],
    queryFn: async () => {
      // phase 5: aps with their zielrelevant zaehleinheiten; sort by the
      // einheit-werte sort client-side
      const ids = aps.map((ap) => ap.value)
      if (!ids.length) return { allAps: { nodes: [] } } as EkplanApQueryResult
      const [apRows, ekzaehleinheitRows, einheitWerteRows] = await Promise.all([
        apiFetch<{ id: string }[]>(`/q_ap?id=in.(${ids.join(',')})&select=id`),
        apiFetch<
          {
            ap_id: string
            zaehleinheit_id: number | null
            zielrelevant: boolean | null
          }[]
        >(
          `/ekzaehleinheit?ap_id=in.(${ids.join(',')})&zielrelevant=eq.true&select=ap_id,zaehleinheit_id:zaehleinheit_id,zielrelevant`,
        ),
        apiFetch<
          {
            id: number
            code: number
            text: string | null
            sort: number | null
          }[]
        >('/v_tpopkontrzaehl_einheit_werte?select=id,code,text,sort'),
      ])
      const werteById = new Map((einheitWerteRows ?? []).map((w) => [w.id, w]))
      const nodes = (apRows ?? []).map((a) => ({
        id: a.id,
        ekzaehleinheitsByApId: {
          nodes: (ekzaehleinheitRows ?? [])
            .filter((e) => e.ap_id === a.id && e.zaehleinheit_id != null)
            .map((e) => ({
              id: `${a.id}_${e.zaehleinheit_id}`,
              tpopkontrzaehlEinheitWerteByZaehleinheitId: {
                id: e.zaehleinheit_id,
                code: werteById.get(e.zaehleinheit_id ?? 0)?.code,
                text: werteById.get(e.zaehleinheit_id ?? 0)?.text ?? null,
                sort: werteById.get(e.zaehleinheit_id ?? 0)?.sort ?? 0,
              },
            }))
            // former orderBy ...EINHEIT_WERTE_BY_ZAEHLEINHEIT_ID__SORT_ASC
            .sort(
              (x, y) =>
                (x.tpopkontrzaehlEinheitWerteByZaehleinheitId.sort ?? 0) -
                (y.tpopkontrzaehlEinheitWerteByZaehleinheitId.sort ?? 0),
            ),
        },
      }))
      return { allAps: { nodes } } as unknown as EkplanApQueryResult
    },
  })
  // mirror the query data into atoms for the ApList children.
  // must run in an effect: writing atoms during render causes
  // "Cannot update a component while rendering a different component"
  useEffect(() => {
    setApsData(data as unknown as EkPlanApsData)
    setApsDataLoading(false)
  }, [data, setApsData, setApsDataLoading])

  const onClickAnleitung = () => {
    const url = `${appBaseUrl()}Dokumentation/erfolgs-kontrollen-planen`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  const onClickResetFilter = () => {
    setFilterAp(null)
    setFilterPopNr(null)
    setFilterPopName(null)
    setFilterPopStatus([100, 101, 200, 201, 202, 300])
    setFilterNr(null)
    setFilterGemeinde(null)
    setFilterFlurname(null)
    setFilterStatus([100, 101, 200, 201, 202, 300])
    setFilterBekanntSeit(null)
    setFilterLv95X(null)
    setFilterLv95Y(null)
    setFilterEkfKontrolleur(null)
    setFilterEkfrequenzAbweichend(false)
    setFilterEkAbrechnungstyp(null)
    setFilterEkfrequenz(null)
    setFilterEkfrequenzStartjahr(null)
    setFilterAnsiedlungYear(null)
    setFilterKontrolleYear(null)
    setFilterEkplanYear(null)
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Suspense fallback={<Spinner />}>
          {!!userToken && (
            <>
              <div className={styles.header}>
                <ApList />
                <div className={styles.buttonContainer}>
                  <Button
                    variant="outlined"
                    onClick={onClickAnleitung}
                    color="inherit"
                    className={styles.anleitungButton}
                  >
                    Anleitung
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={onClickResetFilter}
                    color="inherit"
                    className={styles.filterResetButton}
                  >
                    Filter leeren
                  </Button>
                </div>
                <Choose />
              </div>
              {!!aps.length && (
                <Suspense fallback={<Spinner />}>
                  <Table />
                </Suspense>
              )}
            </>
          )}
          <User />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
