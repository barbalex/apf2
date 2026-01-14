import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { groupBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { Select } from '../../../shared/Select.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { query as tpopQuery } from '../Tpop/query.ts'
import { EkYear } from './EkYear.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { query } from './query.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import {
  popStatusWerte,
  tpop,
  tpopApberrelevantGrundWerte,
} from '../../../shared/fragments.js'
import { fieldTypes } from '../Tpop/Tpop.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

import type {
  TpopId,
  PopId,
  TpopStatusWerteCode,
  TpopApberrelevantGrundWerteCode,
  EkfrequenzId,
  AdresseId,
  TpopkontrId,
  EkplanId,
  ApId,
} from '../../../../generated/apflora/models.js'

import styles from './index.module.css'

interface TpopEkQueryResult {
  tpopById?: {
    id: TpopId
    popId: PopId
    nr?: number | null
    gemeinde?: number | null
    flurname?: string | null
    status?: TpopStatusWerteCode | null
    bekanntSeit?: number | null
    statusUnklar?: boolean | null
    statusUnklarGrund?: string | null
    lv95X?: number | null
    lv95Y?: number | null
    wgs84Lat?: number | null
    wgs84Long?: number | null
    radius?: number | null
    hoehe?: number | null
    exposition?: string | null
    klima?: string | null
    neigung?: string | null
    beschreibung?: string | null
    katasterNr?: string | null
    apberRelevant?: number | null
    apberRelevantGrund?: TpopApberrelevantGrundWerteCode | null
    eigentuemer?: string | null
    kontakt?: string | null
    nutzungszone?: string | null
    bewirtschafter?: string | null
    bewirtschaftung?: string | null
    ekfrequenz?: EkfrequenzId | null
    ekfrequenzAbweichend?: boolean | null
    ekfrequenzStartjahr?: number | null
    ekfKontrolleur?: AdresseId | null
    bemerkungen?: string | null
    popStatusWerteByStatus?: {
      id: TpopStatusWerteCode
      text?: string | null
    } | null
    tpopApberrelevantGrundWerteByApberRelevantGrund?: {
      id: TpopApberrelevantGrundWerteCode
      text?: string | null
    } | null
    popByPopId?: {
      id: PopId
      apId: ApId
    } | null
  } | null
}

interface TpopEkListsQueryResult {
  allEkplans?: {
    nodes: {
      id: EkplanId
      jahr?: number | null
      typ?: string | null
    }[]
  } | null
  allTpopkontrs?: {
    nodes: {
      id: TpopkontrId
      jahr?: number | null
      typ?: string | null
    }[]
  } | null
  allEkfrequenzs?: {
    nodes: {
      id: EkfrequenzId
      code?: string | null
      anwendungsfall?: string | null
    }[]
  } | null
  allAdresses?: {
    nodes: {
      value: AdresseId
      label?: string | null
    }[]
  } | null
}

export const Component = observer(() => {
  const { tpopId, apId } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const {
    data,
    loading,
    error,
    refetch: refetchTpop,
  } = useQuery<TpopEkQueryResult>(tpopQuery, {
    variables: { id: tpopId },
  })

  const row = data?.tpopById ?? {}
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const saveToDb = async (event) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: tpopId,
      [field]: value,
      changedBy: store.user.name,
    }
    try {
      await apolloClient.mutate({
        mutation: gql`
            mutation updateTpop${field}(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateTpopById(
                input: {
                  id: $id
                  tpopPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpop {
                  ...TpopFields
                  popStatusWerteByStatus {
                    ...PopStatusWerteFields
                  }
                  tpopApberrelevantGrundWerteByApberRelevantGrund {
                    ...TpopApberrelevantGrundWerteFields
                  }
                  popByPopId {
                    id
                    apId
                  }
                }
              }
            }
            ${popStatusWerte}
            ${tpop}
            ${tpopApberrelevantGrundWerte}
          `,
        variables,
        // no optimistic responce as geomPoint
      })
    } catch (error) {
      return setFieldErrors({ [field]: (error as Error).message })
    }
    // update tpop on map
    if (
      (value &&
        ((field === 'ylv95Y' && row?.lv95X) ||
          (field === 'lv95X' && row?.y))) ||
      (!value && (field === 'ylv95Y' || field === 'lv95X'))
    ) {
      tsQueryClient.invalidateQueries({
        queryKey: [`PopForMapQuery`],
      })
      tsQueryClient.invalidateQueries({
        queryKey: [`TpopForMapQuery`],
      })
    }
    if (Object.keys(fieldErrors).length) {
      setFieldErrors({})
    }
    if (['nr', 'flurname'].includes(field)) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
    }
  }

  const {
    data: dataEk,
    loading: loadingEk,
    error: errorEk,
  } = useQuery<TpopEkListsQueryResult>(query, {
    variables: {
      id: tpopId,
      apId,
    },
  })

  const ekfrequenzOptions0 = dataEk?.allEkfrequenzs?.nodes ?? []
  const longestAnwendungsfall = Math.max(
    ...ekfrequenzOptions0.map((a) => (a.anwendungsfall || '').length),
  )
  const ekfrequenzOptions = ekfrequenzOptions0.map((o) => {
    const code = (o.code || '').padEnd(8)
    const anwendungsfall =
      `${(o.anwendungsfall || '').padEnd(longestAnwendungsfall)}` || ''
    return {
      value: o.id,
      label: `${code}: ${anwendungsfall}`,
    }
  })

  const ekGroupedByYear = groupBy(
    [
      ...(dataEk?.allTpopkontrs?.nodes ?? [])
        .filter((e) => e.jahr !== null)
        .map((t) => ({ ...t, is: 'ek' as const })),
      ...(dataEk?.allEkplans?.nodes ?? [])
        .filter((e) => e.jahr !== null)
        .map((t) => ({ ...t, is: 'ekplan' as const })),
    ],
    (e) => e.jahr,
  )

  if (loadingEk) return <Spinner />

  if (!row) return null

  return (
    <ErrorBoundary>
      <FormTitle title="EK" />
      <div className={styles.container}>
        <div className={styles.formContainerNoColumnsInner}>
          <div className={styles.ekfrequenzOptionsContainer}>
            <RadioButtonGroup
              name="ekfrequenz"
              dataSource={ekfrequenzOptions}
              loading={loadingEk}
              label="EK-Frequenz"
              value={row.ekfrequenz}
              saveToDb={saveToDb}
              error={fieldErrors.ekfrequenz}
            />
          </div>
          <Checkbox2States
            name="ekfrequenzAbweichend"
            label="EK-Frequenz abweichend"
            value={row.ekfrequenzAbweichend}
            saveToDb={saveToDb}
            error={fieldErrors.ekfrequenzAbweichend}
          />
          <TextField
            name="ekfrequenzStartjahr"
            label="Startjahr"
            type="number"
            value={row.ekfrequenzStartjahr}
            saveToDb={saveToDb}
            error={fieldErrors.ekfrequenzStartjahr}
          />
          <Select
            key={`${row?.id}ekfKontrolleur`}
            name="ekfKontrolleur"
            label="EKF-KontrolleurIn (nur Adressen mit zugeordnetem Benutzer-Konto)"
            options={dataEk?.allAdresses?.nodes ?? []}
            loading={loadingEk}
            value={row.ekfKontrolleur}
            saveToDb={saveToDb}
            error={fieldErrors.ekfKontrolleur}
          />
        </div>
        <h5 className={styles.ekplanTitle}>EK-Plan</h5>
        <Table
          size="small"
          className={styles.styledTable}
        >
          <TableHead>
            <TableRow>
              <TableCell>Jahr</TableCell>
              <TableCell>geplant</TableCell>
              <TableCell>ausgeführt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingEk ?
              <TableRow>
                <TableCell>Lade...</TableCell>
              </TableRow>
            : errorEk ?
              <TableRow>
                <TableCell>{errorEk.message}</TableCell>
              </TableRow>
            : Object.keys(ekGroupedByYear)
                .reverse()
                .map((year) => (
                  <EkYear
                    key={year}
                    data={ekGroupedByYear[year]}
                  />
                ))
            }
          </TableBody>
        </Table>
      </div>
    </ErrorBoundary>
  )
})
