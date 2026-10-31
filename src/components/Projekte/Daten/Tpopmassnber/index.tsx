import { apiFetch } from '../../../../modules/api.ts'
import { tpopmassnberSelect } from '../../../../modules/selects.ts'
import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Menu } from './Menu.tsx'

import type { ComponentType } from 'react'

import type { TpopmassnberId } from '../../../../models/apflora/Tpopmassnber.ts'
import type { TpopId } from '../../../../models/apflora/Tpop.ts'
import type { PopId } from '../../../../models/apflora/Pop.ts'
import type { ApId } from '../../../../models/apflora/Ap.ts'

interface TpopmassnberNode {
  id: TpopmassnberId
  jahr: number | null
  beurteilung: number | null
  bemerkungen: string | null
  tpopId: TpopId
  changedBy: string | null
  tpopByTpopId: {
    id: TpopId
    popByPopId: {
      id: PopId
      apId: ApId
    }
  }
}

interface TpopmassnberQueryResult {
  tpopmassnberById: TpopmassnberNode | null
  allTpopmassnErfbeurtWertes: {
    nodes: {
      value: number
      label: string
    }[]
  }
}

// shared RadioButtonGroup's props are inferred from an untyped signature
// (dataSource infers as never, value as null);
// declare the shape this form passes
const TypedRadioButtonGroup = RadioButtonGroup as unknown as ComponentType<{
  name: string
  label: string
  dataSource?: { value: number; label: string }[] | undefined
  loading?: boolean
  value?: number | null | undefined
  saveToDb: (event: {
    target: { name?: string; value: string | number | null }
  }) => void
  error?: string | undefined
}>

import styles from './index.module.css'
import { apiUpdateByVariables } from '../../../../modules/api.ts'

export const tpopmassnberQueryOptions = (id: string | undefined) => ({
  queryKey: ['tpopmassnber', id],
  queryFn: async () => {
    const [rows, werte] = await Promise.all([
      apiFetch<NonNullable<TpopmassnberQueryResult['tpopmassnberById']>[]>(
        `/v_tpopmassnber?id=eq.${id ?? ''}&select=${tpopmassnberSelect},tpopByTpopId:tpop_by_tpop_id`,
      ),
      apiFetch<
        NonNullable<
          TpopmassnberQueryResult['allTpopmassnErfbeurtWertes']
        >['nodes']
      >(
        `/tpopmassn_erfbeurt_werte?order=sort.asc&select=value:code,label:text`,
      ),
    ])
    return {
      tpopmassnberById: rows?.[0] ?? null,
      allTpopmassnErfbeurtWertes: { nodes: werte ?? [] },
    }
  },
})

export const Component = () => {
  const { tpopmassnberId: id } = useParams()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // suspense is still honoured by useQuery at runtime but is no longer part
  // of its option types; building the options outside the call keeps the
  // excess property check from complaining about it
  const tpopmassnberOptions = {
    ...tpopmassnberQueryOptions(id),
    suspense: true,
  }
  const { data } = useQuery(tpopmassnberOptions)

  const row: Partial<TpopmassnberNode> = data?.tpopmassnberById ?? {}
  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name ?? ''
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apiUpdateByVariables('tpopmassnber', variables)
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // invalidate tpopmassnber query
    void tsQueryClient.invalidateQueries({ queryKey: ['tpopmassnber', id] })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    if (['jahr', 'beurteilung'].includes(field)) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopmassnber`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Massnahmen-Bericht Teil-Population"
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
          <TypedRadioButtonGroup
            name="beurteilung"
            label="Entwicklung"
            dataSource={data?.allTpopmassnErfbeurtWertes?.nodes}
            value={row.beurteilung}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.beurteilung}
          />
          <TextField
            name="bemerkungen"
            label="Interpretation"
            type="text"
            multiLine
            value={row.bemerkungen}
            saveToDb={saveToDb}
            error={fieldErrors.bemerkungen}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
