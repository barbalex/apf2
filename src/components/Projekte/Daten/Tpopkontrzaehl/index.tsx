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
import { Select } from '../../../shared/Select.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Menu } from './Menu.tsx'

import type { ComponentType } from 'react'

import type { TpopkontrzaehlId } from '../../../../models/apflora/Tpopkontrzaehl.ts'

interface TpopkontrzaehlNode {
  id: TpopkontrzaehlId
  einheit: number | null
  anzahl: number | null
  methode: number | null
}

interface TpopkontrzaehlQueryResult {
  tpopkontrzaehlById: TpopkontrzaehlNode | null
  allTpopkontrzaehlEinheitWertes: {
    nodes: {
      id: string
      value: number
      label: string
    }[]
  }
  allTpopkontrzaehlMethodeWertes: {
    nodes: {
      id: string
      value: number
      label: string
    }[]
  }
  otherZaehlOfEk: {
    nodes: {
      id: TpopkontrzaehlId
      einheit: number | null
    }[]
  }
}

// shared RadioButtonGroup's props are inferred from an untyped signature
// (dataSource infers as never, value as null);
// declare the shape this form passes
const TypedRadioButtonGroup = RadioButtonGroup as unknown as ComponentType<{
  name: string
  label: string
  dataSource: { value: number; label: string }[]
  value?: number | null | undefined
  saveToDb: (event: {
    target: { name?: string; value: string | number | null }
  }) => void
  error?: string | undefined
}>

import styles from './index.module.css'
import { apiFetch, apiUpdateByVariables } from '../../../../modules/api.ts'

// react-query v5 omitted suspense from the public useQuery options
// although it is still honored at runtime
type TpopkontrzaehlUseQueryOptions = UseQueryOptions<
  TpopkontrzaehlQueryResult | undefined,
  Error
> & {
  suspense: boolean
}

export const tpopkontrzaehlQueryOptions = (
  tpopkontrzaehlId: string | undefined,
  tpopkontrId: string | undefined,
) => ({
  queryKey: ['tpopkontrzaehl', tpopkontrzaehlId, tpopkontrId],
  queryFn: async () => {
    const [rows, einheitWertes, methodeWertes, otherZaehl] = await Promise.all([
      apiFetch<TpopkontrzaehlNode[]>(
        `/v_tpopkontrzaehl?id=eq.${tpopkontrzaehlId}&select=id,einheit,anzahl,methode`,
      ),
      apiFetch<{ id: string; value: number; label: string }[]>(
        `/tpopkontrzaehl_einheit_werte?select=id,value:code,label:text&order=sort.asc`,
      ),
      apiFetch<{ id: string; value: number; label: string }[]>(
        `/tpopkontrzaehl_methode_werte?select=id,value:code,label:text&order=sort.asc`,
      ),
      apiFetch<{ id: TpopkontrzaehlId; einheit: number | null }[]>(
        `/q_tpopkontrzaehl?tpopkontr_id=eq.${tpopkontrId}&id=neq.${tpopkontrzaehlId}&select=id,einheit`,
      ),
    ])
    return {
      tpopkontrzaehlById: rows?.[0] ?? null,
      allTpopkontrzaehlEinheitWertes: { nodes: einheitWertes ?? [] },
      allTpopkontrzaehlMethodeWertes: { nodes: methodeWertes ?? [] },
      otherZaehlOfEk: { nodes: otherZaehl ?? [] },
    }
  },
})

export const Component = () => {
  const { tpopkontrzaehlId, tpopkontrId } = useParams()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const tpopkontrzaehlOptions: TpopkontrzaehlUseQueryOptions = {
    ...tpopkontrzaehlQueryOptions(tpopkontrzaehlId, tpopkontrId),
    suspense: true,
  }
  const { data } = useQuery(tpopkontrzaehlOptions)

  const zaehlEinheitCodesAlreadyUsed = (data?.otherZaehlOfEk?.nodes ?? [])
    .map((n) => n.einheit)
    // prevent null values which cause error in query
    .filter((e) => !!e)

  // filter out already used in other zaehlung of same kontr
  const zaehlEinheitOptions = (
    data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []
  ).filter((o) => !zaehlEinheitCodesAlreadyUsed.includes(o.value))

  const row: Partial<TpopkontrzaehlNode> = data?.tpopkontrzaehlById ?? {}

  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name ?? ''
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apiUpdateByVariables('tpopkontrzaehl', variables)
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // invalidate tpopkontrzaehl query
    void tsQueryClient.invalidateQueries({
      queryKey: ['tpopkontrzaehl', tpopkontrzaehlId, tpopkontrId],
    })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontrzaehl`],
    })
  }

  // console.log('Tpopkontrzaehl rendering')

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Zählung"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <Select
            key={`${tpopkontrzaehlId}einheit`}
            name="einheit"
            label="Einheit"
            options={zaehlEinheitOptions}
            value={row.einheit ?? null}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.einheit ?? ''}
          />
          <TextField
            name="anzahl"
            label="Anzahl"
            type="number"
            value={row.anzahl}
            saveToDb={saveToDb}
            error={fieldErrors.anzahl}
          />
          <TypedRadioButtonGroup
            name="methode"
            label="Methode"
            dataSource={data?.allTpopkontrzaehlMethodeWertes?.nodes ?? []}
            value={row.methode}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.methode}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
