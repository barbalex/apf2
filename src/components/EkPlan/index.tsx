import { lazy, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client/react'
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
import { queryAps } from './queryAps.ts'
import { appBaseUrl } from '../../modules/appBaseUrl.ts'
import {
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
const Error = lazy(async () => ({
  default: (await import('../shared/Error.tsx')).Error,
}))
const ErrorBoundary = lazy(async () => ({
  default: (await import('../shared/ErrorBoundary.tsx')).ErrorBoundary,
}))
const User = lazy(async () => ({ default: (await import('../User.tsx')).User }))
const Spinner = lazy(async () => ({
  default: (await import('../shared/Spinner.tsx')).Spinner,
}))

import styles from './index.module.css'

export const Component = () => {
  const apolloClient = useApolloClient()
  const userToken = useAtomValue(userTokenAtom)
  const aps = useAtomValue(ekPlanApsAtom)
  const apsData = useAtomValue(ekPlanApsDataAtom)
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

  const { data } = useQuery({
    queryKey: ['ekplanAps', aps.map((ap) => ap.value)],
    queryFn: async () => {
      const result = await apolloClient.query<EkplanApQueryResult>({
        query: queryAps,
        variables: {
          ids: aps.map((ap) => ap.value),
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })
  setApsData(data)
  setApsDataLoading(false)

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
