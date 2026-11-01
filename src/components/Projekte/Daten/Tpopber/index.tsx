import { apiFetch } from '../../../../modules/api.ts'
import { tpopberSelect } from '../../../../modules/selects.ts'
import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState } from 'react'
import { useParams } from 'react-router'
import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Menu } from './Menu.tsx'

import type {
  TpopId,
  TpopEntwicklungWerteCode,
} from '../../../../models/apflora/index.ts'
import type { TpopberId } from '../../../../models/apflora/Tpopber.ts'

import styles from './index.module.css'
import { apiUpdateByVariables } from '../../../../modules/api.ts'

interface TpopberQueryResult {
  tpopberById?: {
    id: TpopberId
    tpopId: TpopId
    jahr?: number | null
    entwicklung?: TpopEntwicklungWerteCode | null
    bemerkungen?: string | null
    changedBy?: string | null
  } | null
  allTpopEntwicklungWertes?: {
    nodes: {
      value: TpopEntwicklungWerteCode
      label?: string | null
    }[]
  } | null
}

// react-query v5 omitted suspense from the public useQuery options
// although it is still honored at runtime
type TpopberUseQueryOptions = UseQueryOptions<
  TpopberQueryResult | undefined,
  Error
> & {
  suspense: boolean
}

export const tpopberQueryOptions = (id: string | undefined) => ({
  queryKey: ['tpopber', id],
  queryFn: async () => {
    const [rows, werte] = await Promise.all([
      apiFetch<NonNullable<TpopberQueryResult['tpopberById']>[]>(
        `/v_tpopber?id=eq.${id}&select=${tpopberSelect}`,
      ),
      apiFetch<
        NonNullable<TpopberQueryResult['allTpopEntwicklungWertes']>['nodes']
      >(`/tpop_entwicklung_werte?order=sort.asc&select=value:code,label:text`),
    ])
    return {
      tpopberById: rows?.[0] ?? null,
      allTpopEntwicklungWertes: { nodes: werte ?? [] },
    }
  },
})

export const Component = () => {
  const { tpopberId } = useParams()

  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const tpopberOptions: TpopberUseQueryOptions = {
    ...tpopberQueryOptions(tpopberId),
    suspense: true,
  }
  const { data } = useQuery(tpopberOptions)

  const row = (data?.tpopberById ?? {}) as NonNullable<
    TpopberQueryResult['tpopberById']
  >
  const userName = useAtomValue(userNameAtom)

  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name ?? ''
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apiUpdateByVariables('tpopber', variables)
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // invalidate tpopber query
    void tsQueryClient.invalidateQueries({ queryKey: ['tpopber', tpopberId] })
    // only set if necessary (to reduce renders)
    if (Object.keys(fieldErrors).length) {
      setFieldErrors((prev) => {
        const { [field]: _, ...rest } = prev
        return rest
      })
    }
    if (['jahr', 'entwicklung'].includes(field)) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopber`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Kontroll-Bericht Teil-Population"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <TextField
            name="jahr"
            label="Jahr"
            type="number"
            value={row.jahr}
            saveToDb={saveToDb}
            error={fieldErrors.jahr}
          />
          <RadioButtonGroup
            name="entwicklung"
            label="Entwicklung"
            dataSource={
              (data?.allTpopEntwicklungWertes?.nodes ?? []) as never[]
            }
            value={row.entwicklung as null}
            saveToDb={saveToDb}
            error={fieldErrors.entwicklung}
          />
          <TextField
            name="bemerkungen"
            label="Bemerkungen"
            type="text"
            value={row.bemerkungen}
            multiLine
            saveToDb={saveToDb}
            error={fieldErrors.bemerkungen}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
