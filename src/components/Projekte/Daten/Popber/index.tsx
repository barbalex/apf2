import { apiFetch } from '../../../../modules/api.ts'
import { popberSelect } from '../../../../modules/selects.ts'
import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState } from 'react'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Menu } from './Menu.tsx'

import type {
  PopberId,
  PopId,
  TpopEntwicklungWerteCode,
} from '../../../../models/apflora/index.ts'

import styles from './index.module.css'
import { apiUpdateByVariables } from '../../../../modules/api.ts'

interface PopberQueryResult {
  popberById?: {
    id: PopberId
    popId: PopId
    jahr: number | null
    entwicklung: TpopEntwicklungWerteCode | null
    bemerkungen: string | null
    tpopEntwicklungWerteByEntwicklung?: {
      code: TpopEntwicklungWerteCode
      text: string | null
      sort: number | null
    }
    popByPopId?: {
      id: PopId
      nr: number | null
      name: string | null
    }
  }
  allTpopEntwicklungWertes?: {
    nodes: {
      value: TpopEntwicklungWerteCode
      label: string | null
    }[]
  }
}

export const popberQueryOptions = (id: string | undefined) => ({
  queryKey: ['popber', id],
  queryFn: async () => {
    const [rows, werte] = await Promise.all([
      apiFetch<NonNullable<PopberQueryResult['popberById']>[]>(
        `/v_popber?id=eq.${id}&select=${popberSelect},tpopEntwicklungWerteByEntwicklung:tpop_entwicklung_werte_by_entwicklung,popByPopId:pop_by_pop_id`,
      ),
      apiFetch(
        `/tpop_entwicklung_werte?order=sort.asc&select=value:code,label:text`,
      ),
    ])
    return {
      popberById: rows?.[0] ?? null,
      allTpopEntwicklungWertes: { nodes: werte ?? [] },
    }
  },
})

export const Component = () => {
  const { popberId: id } = useParams()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useSuspenseQuery(popberQueryOptions(id))

  const row: Partial<NonNullable<PopberQueryResult['popberById']>> =
    data?.popberById ?? {}
  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name
    if (!field) return
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apiUpdateByVariables('popber', variables)
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // only set if necessary (to reduce renders)
    if (Object.keys(fieldErrors).length) {
      setFieldErrors((prev) => {
        const { [field]: _, ...rest } = prev
        return rest
      })
    }
    // Invalidate queries to refetch data
    void tsQueryClient.invalidateQueries({
      queryKey: ['popber', id],
    })
    if (['jahr', 'entwicklung'].includes(field)) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treePopber`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Kontroll-Bericht Population"
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
