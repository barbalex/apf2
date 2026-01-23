import { useState, Suspense } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button'

import { queryAll } from './queryAll.ts'
import { queryForExport } from './queryForExport.ts'
import { CellForYearMenu } from './CellForYearMenu/index.tsx'
import { getYears } from './getYears.ts'
import { Error } from '../../shared/Error.tsx'
import { exportRowFromTpop } from './exportRowFromTpop.ts'
import { exportModule } from '../../../modules/export.ts'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'
import { Spinner } from '../../shared/Spinner.tsx'
import { SpinnerOverlay } from '../../shared/SpinnerOverlay.tsx'
import { TpopRow } from './Row/index.tsx'
import { EkplanTableHeader } from './Header.tsx'

import type { TpopId } from '../../../models/apflora/Tpop.ts'

import {
  addNotificationAtom,
  ekPlanApsAtom,
  ekPlanApValuesAtom,
  ekPlanYearMenuAnchorAtom,
  ekPlanShowEkAtom,
  ekPlanShowEkfAtom,
  ekPlanShowMassnAtom,
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
}) => {
  const tpopFilter = { popByPopId: { apId: { in: apValues } } }
  if (filterAp) {
    tpopFilter.apName = { includesInsensitive: filterAp }
  }
  if (filterPopNr) {
    tpopFilter.popByPopId.nr = { equalTo: filterPopNr }
  }
  if (filterPopName) {
    tpopFilter.popByPopId.name = { includesInsensitive: filterPopName }
  }
  if (filterPopStatus) {
    tpopFilter.popByPopId.popStatusWerteByStatus = {
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
  const apolloClient = useApolloClient()

  const aps = useAtomValue(ekPlanApsAtom)
  const apValues = useAtomValue(ekPlanApValuesAtom)
  const yearMenuAnchor = useAtomValue(ekPlanYearMenuAnchorAtom)
  const showEk = useAtomValue(ekPlanShowEkAtom)
  const showEkf = useAtomValue(ekPlanShowEkfAtom)
  const showMassn = useAtomValue(ekPlanShowMassnAtom)
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

  const { data, error, refetch } = useQuery<EkplanTpopQueryResult>({
    queryKey: ['EkplanTpopQuery', tpopFilter],
    queryFn: () =>
      apolloClient
        .query<EkplanTpopQueryResult>({
          query: queryAll,
          variables: { tpopFilter },
        })
        .then((result) => result.data),
  })

  const tpops = data?.allTpops?.nodes ?? []
  const years = getYears(pastYears)

  // when this value changes, year columns are re-rendered as it is added as key
  // needed because otherwise when changing filters column widths can be off
  const yearHeaderRerenderValue = JSON.stringify([
    filterAnsiedlungYear,
    filterKontrolleYear,
    filterEkplanYear,
  ])

  const onClickExport = async () => {
    let result
    try {
      result = await apolloClient.query({
        query: queryForExport,
        variables: { tpopFilter, apIds: apValues },
      })
    } catch (error) {
      return addNotification({
        message: `Fehler beim Abfragen für den Export: ${(error as Error).message}`,
        options: {
          variant: 'error',
        },
      })
    }
    const tpops = result?.data?.allTpops?.nodes ?? []
    const ekfrequenzs = result?.data?.allEkfrequenzs?.nodes ?? []
    const data = tpops.map((tpop) =>
      exportRowFromTpop({ tpop, years, ekfrequenzs }),
    )
    exportModule({ data, fileName: 'ek-planung' })
  }

  // TODO: give button to remove all filters in case something goes wrong

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      {processing && (
        <SpinnerOverlay message="Startjahr und EK-Pläne werden gesetzt" />
      )}
      <Suspense fallback={<Spinner />}>
        <Button
          variant="outlined"
          onClick={onClickExport}
          color="inherit"
          className={styles.exportButton}
        >
          exportieren
        </Button>
        <div className={styles.container}>
          <div className={styles.scrollContainer}>
            <EkplanTableHeader
              tpopLength={tpops.length !== 0 ? tpops.length : '...'}
              tpopFilter={tpopFilter}
              refetch={refetch}
              years={years}
            />
            {tpops.map((tpop, index) => (
              <TpopRow
                key={tpop.id}
                tpopId={tpop.id}
                index={index}
                setProcessing={setProcessing}
                years={years}
              />
            ))}
          </div>
        </div>
      </Suspense>
      {!!yearMenuAnchor && <CellForYearMenu />}
    </ErrorBoundary>
  )
}
