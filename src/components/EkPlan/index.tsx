import { useContext, lazy, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client/react'
import Button from '@mui/material/Button'

const ApList = lazy(async () => ({
  default: (await import('./ApList/index.tsx')).ApList,
}))
const Table = lazy(async () => ({
  default: (await import('./Table/index.tsx')).EkPlanTable,
}))
const Choose = lazy(async () => ({
  default: (await import('./Choose.tsx')).Choose,
}))
import { queryAps } from './queryAps.js'
import { MobxContext } from '../../mobxContext.js'
import { appBaseUrl } from '../../modules/appBaseUrl.js'
const Error = lazy(async () => ({
  default: (await import('../shared/Error.jsx')).Error,
}))
const ErrorBoundary = lazy(async () => ({
  default: (await import('../shared/ErrorBoundary.jsx')).ErrorBoundary,
}))
const User = lazy(async () => ({ default: (await import('../User.jsx')).User }))
const Spinner = lazy(async () => ({
  default: (await import('../shared/Spinner.jsx')).Spinner,
}))

import styles from './index.module.css'

export const Component = observer(() => {
  const store = useContext(MobxContext)
  const { user } = store
  const { aps, setApsData, setApsDataLoading } = store.ekPlan
  const {
    setFilterAp,
    setFilterPopNr,
    setFilterPopName,
    setFilterPopStatus,
    setFilterNr,
    setFilterGemeinde,
    setFilterFlurname,
    setFilterStatus,
    setFilterBekanntSeit,
    setFilterLv95X,
    setFilterLv95Y,
    setFilterEkfKontrolleur,
    setFilterEkfrequenzAbweichend,
    setFilterEkAbrechnungstyp,
    setFilterEkfrequenz,
    setFilterEkfrequenzStartjahr,
    setFilterAnsiedlungYear,
    setFilterKontrolleYear,
    setFilterEkplanYear,
  } = store.ekPlan

  const { data, loading, error } = useQuery(queryAps, {
    variables: {
      ids: aps.map((ap) => ap.value),
    },
  })
  setApsData(data)
  setApsDataLoading(loading)

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

  if (error) {
    return (
      <Suspense fallback={<Spinner />}>
        <Error error={error} />
      </Suspense>
    )
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Suspense fallback={<Spinner />}>
          {!!user.token && (
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
              {!!aps.length && <Table />}
            </>
          )}
          <User />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
})
