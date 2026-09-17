import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState, Suspense } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { groupBy } from 'es-toolkit'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { Select } from '../../../shared/Select.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { query as tpopQuery } from '../Tpop/query.ts'
import { EkYear } from './EkYear.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { query } from './query.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import {
  popStatusWerte,
  tpop as tpopFragment,
  tpopApberrelevantGrundWerte,
} from '../../../shared/fragments.ts'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type {
  TpopId,
  PopId,
  TpopStatusWerteCode,
  TpopApberrelevantGrundWerteCode,
  EkfrequenzId,
  AdresseId,
  TpopkontrId,
  ApId,
} from '../../../../models/apflora/index.ts'
import type { EkplanId } from '../../../../models/apflora/Ekplan.ts'

import styles from './index.module.css'

interface EkYearData {
  id: TpopkontrId | EkplanId
  jahr?: number | null
  typ?: string | null
  is: 'ek' | 'ekplan'
}

interface EkPlanTableProps {
  ekGroupedByYear: Record<string, EkYearData[]>
}

const EkPlanTable = ({ ekGroupedByYear }: EkPlanTableProps) => {
  return (
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
        {Object.keys(ekGroupedByYear)
          .reverse()
          .map((year) => (
            <EkYear
              key={year}
              data={ekGroupedByYear[year] ?? []}
            />
          ))}
      </TableBody>
    </Table>
  )
}

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
      label: string | null
    }[]
  } | null
}

const fieldTypes: Record<string, string> = {
  popId: 'UUID',
  nr: 'Int',
  gemeinde: 'String',
  flurname: 'String',
  radius: 'Int',
  hoehe: 'Int',
  exposition: 'String',
  klima: 'String',
  neigung: 'String',
  bodenTyp: 'String',
  bodenKalkgehalt: 'String',
  bodenDurchlaessigkeit: 'String',
  bodenHumus: 'String',
  bodenNaehrstoffgehalt: 'String',
  bodenAbtrag: 'String',
  wasserhaushalt: 'String',
  beschreibung: 'String',
  katasterNr: 'String',
  status: 'Int',
  statusUnklarGrund: 'String',
  apberRelevant: 'Boolean',
  apberRelevantGrund: 'Int',
  bekanntSeit: 'Int',
  eigentuemer: 'String',
  kontakt: 'String',
  nutzungszone: 'String',
  bewirtschafter: 'String',
  bewirtschaftung: 'String',
  ekfrequenz: 'UUID',
  ekfrequenzAbweichend: 'Boolean',
  ekfKontrolleur: 'UUID',
  ekfrequenzStartjahr: 'Int',
  bemerkungen: 'String',
  statusUnklar: 'Boolean',
}

// react-query v5 omitted suspense from the public useQuery options
// although it is still honored at runtime
type TpopEkUseQueryOptions = UseQueryOptions<
  TpopEkQueryResult | undefined,
  Error
> & {
  suspense: boolean
}

type TpopEkListsUseQueryOptions = UseQueryOptions<
  TpopEkListsQueryResult | undefined,
  Error
> & {
  suspense: boolean
}

export const Component = () => {
  const { tpopId, apId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const tpopEkQueryOptions: TpopEkUseQueryOptions = {
    queryKey: ['TpopEk', tpopId],
    queryFn: async () => {
      const result = await apolloClient.query<TpopEkQueryResult>({
        query: tpopQuery,
        variables: { id: tpopId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  }
  const { data: tpopData } = useQuery(tpopEkQueryOptions)

  const tpop = (tpopData?.tpopById ?? {}) as NonNullable<
    TpopEkQueryResult['tpopById']
  >
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const userName = useAtomValue(userNameAtom)

  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name ?? ''
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: tpopId,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apolloClient.mutate({
        mutation: dynamicGql`
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
            ${tpopFragment}
            ${tpopApberrelevantGrundWerte}
          `,
        variables,
        // no optimistic responce as geomPoint
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // update tpop on map
    if (
      (value &&
        ((field === 'ylv95Y' && tpop?.lv95X) ||
          (field === 'lv95X' && (tpop as { y?: number | null })?.y))) ||
      (!value && (field === 'ylv95Y' || field === 'lv95X'))
    ) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`PopForMapQuery`],
      })
      void tsQueryClient.invalidateQueries({
        queryKey: [`TpopForMapQuery`],
      })
    }
    if (Object.keys(fieldErrors).length) {
      setFieldErrors((prev) => {
        const { [field]: _, ...rest } = prev
        return rest
      })
    }
    if (['nr', 'flurname'].includes(field)) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treeTpop`],
      })
    }
  }

  const tpopEkListsQueryOptions: TpopEkListsUseQueryOptions = {
    queryKey: ['TpopEkLists', tpopId, apId],
    queryFn: async () => {
      const result = await apolloClient.query<TpopEkListsQueryResult>({
        query: query,
        variables: {
          id: tpopId,
          apId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  }
  const { data: dataEk } = useQuery(tpopEkListsQueryOptions)

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
    (e) => e.jahr as number,
  )

  if (!tpop) return null

  return (
    <ErrorBoundary>
      <FormTitle title="EK" />
      <div className={styles.container}>
        <div className={styles.formContainerNoColumnsInner}>
          <div className={styles.ekfrequenzOptionsContainer}>
            <RadioButtonGroup
              name="ekfrequenz"
              dataSource={ekfrequenzOptions as never[]}
              label="EK-Frequenz"
              value={tpop.ekfrequenz as null}
              saveToDb={saveToDb}
              error={fieldErrors.ekfrequenz}
            />
          </div>
          <Checkbox2States
            name="ekfrequenzAbweichend"
            label="EK-Frequenz abweichend"
            value={tpop.ekfrequenzAbweichend}
            saveToDb={saveToDb}
            error={fieldErrors.ekfrequenzAbweichend}
            helperText=""
          />
          <TextField
            name="ekfrequenzStartjahr"
            label="Startjahr"
            type="number"
            value={tpop.ekfrequenzStartjahr}
            saveToDb={saveToDb}
            error={fieldErrors.ekfrequenzStartjahr}
          />
          <Select
            key={`${tpopId}ekfKontrolleur`}
            name="ekfKontrolleur"
            label="EKF-KontrolleurIn (nur Adressen mit zugeordnetem Benutzer-Konto)"
            options={dataEk?.allAdresses?.nodes ?? []}
            value={tpop.ekfKontrolleur ?? null}
            saveToDb={(e) => void saveToDb(e)}
            error={fieldErrors.ekfKontrolleur ?? ''}
          />
        </div>
        <h5 className={styles.ekplanTitle}>EK-Plan</h5>
        <Suspense
          fallback={
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
                <TableRow>
                  <TableCell>Lade...</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          }
        >
          <EkPlanTable ekGroupedByYear={ekGroupedByYear} />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
