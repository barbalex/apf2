import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { groupBy } from 'es-toolkit'
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
import { EkYear } from './EkYear.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { tpopQueryOptions } from '../Tpop/Tpop.tsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { apiFetch, apiUpdateByVariables } from '../../../../modules/api.ts'
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

  const tsQueryClient = useQueryClient()

  // the tpop row comes from the Tpop form's factory (same shape the
  // form renders)
  const tpopEkQueryOptions: TpopEkUseQueryOptions = {
    // only the key and the fetcher are needed from the factory; the row
    // is cast to TpopEk's narrower view below
    ...(tpopQueryOptions(tpopId) as {
      queryKey: readonly unknown[]
      queryFn: () => Promise<unknown>
    }),
    queryKey: ['TpopEk', tpopId],
    suspense: true,
  } as unknown as TpopEkUseQueryOptions
  const { data: tpopData } = useQuery(tpopEkQueryOptions)

  const tpop = (tpopData ?? {}) as NonNullable<TpopEkQueryResult['tpopById']>
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
      await apiUpdateByVariables('tpop', variables)
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
      // phase 5: the old usersByAdresseIdExist reverse relation becomes
      // an id in-list of the users' adresse_ids
      const usersWithAdresse = await apiFetch<{ adresse_id: string }[]>(
        `/user?select=adresse_id&adresse_id=not.is.null`,
      )
      const adresseIds = [
        ...new Set((usersWithAdresse ?? []).map((u) => u.adresse_id)),
      ]
      const [ekplans, tpopkontrs, ekfrequenzs, adresses] = await Promise.all([
        apiFetch<NonNullable<TpopEkListsQueryResult['allEkplans']>['nodes']>(
          `/ekplan?tpop_id=eq.${tpopId}&select=id,jahr,typ`,
        ),
        apiFetch<NonNullable<TpopEkListsQueryResult['allTpopkontrs']>['nodes']>(
          `/q_tpopkontr?tpop_id=eq.${tpopId}&select=id,jahr,typ`,
        ),
        apiFetch<
          NonNullable<TpopEkListsQueryResult['allEkfrequenzs']>['nodes']
        >(
          `/q_ekfrequenz?ap_id=eq.${apId}&select=id,code,anwendungsfall&order=sort.asc`,
        ),
        apiFetch<NonNullable<TpopEkListsQueryResult['allAdresses']>['nodes']>(
          `/v_adresse?id=in.(${adresseIds.join(',')})&select=value:id,label:name&order=name.asc`,
        ),
      ])
      return {
        allEkplans: { nodes: ekplans ?? [] },
        allTpopkontrs: { nodes: tpopkontrs ?? [] },
        allEkfrequenzs: { nodes: ekfrequenzs ?? [] },
        allAdresses: { nodes: adresses ?? [] },
      }
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
        <EkPlanTable ekGroupedByYear={ekGroupedByYear} />
      </div>
    </ErrorBoundary>
  )
}
