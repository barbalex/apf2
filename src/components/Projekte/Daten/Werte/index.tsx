import { apiFetch, apiUpdate } from '../../../../modules/api.ts'
import { camelToSnake } from '../../../../modules/camelToSnake.ts'
import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState } from 'react'
import { upperFirst } from 'es-toolkit'
import { useParams, useLocation } from 'react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Menu } from './Menu.tsx'

// all wert tables return the same columns;
// the code column is an Int except for ekAbrechnungstypWerte (String)
interface WerteRow {
  id: string
  code: number | string | null
  text: string | null
  sort: number | null
}

import styles from './index.module.css'

export const Component = () => {
  const { wertId: id } = useParams()
  const location = useLocation()
  const { pathname } = location
  const table =
    pathname.includes('ApberrelevantGrundWerte') ? 'tpopApberrelevantGrundWerte'
    : pathname.includes('EkAbrechnungstypWerte') ? 'ekAbrechnungstypWerte'
    : pathname.includes('TpopkontrzaehlEinheitWerte') ?
      'tpopkontrzaehlEinheitWerte'
    : 'uups'

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useSuspenseQuery({
    queryKey: ['werte', table, id],
    queryFn: async () => {
      // phase 5: the werte tables are plain base tables — no v_ view needed
      const rows = await apiFetch<WerteRow[]>(
        `/${camelToSnake(table)}?id=eq.${id}&select=id,code,text,sort`,
      )
      return { [`${table}ById`]: rows?.[0] } as Record<string, WerteRow>
    },
  })

  const row: Partial<WerteRow> = data?.[`${table}ById`] ?? {}

  let codeFieldType = 'number'
  if (['ekAbrechnungstypWerte'].includes(table)) {
    codeFieldType = 'text'
  }

  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name ?? ''
    const value = ifIsNumericAsNumber(event.target.value)

    try {
      if (!row.id) return
      await apiUpdate(camelToSnake(table), row.id, {
        [camelToSnake(field)]: value,
        changed_by: userName,
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    void tsQueryClient.invalidateQueries({
      queryKey: ['werte', table, id],
    })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    if (['text', 'sort'].includes(field)) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`tree${upperFirst(table)}`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title={table}
          MenuBarComponent={Menu}
          menuBarProps={{ row, table }}
        />
        <div className={styles.formContainer}>
          <TextField
            name="text"
            label="Text"
            type="text"
            value={row.text}
            saveToDb={saveToDb}
            error={fieldErrors.text}
          />
          <TextField
            name="code"
            label="Code"
            type={codeFieldType}
            value={row.code}
            saveToDb={saveToDb}
            error={fieldErrors.code}
          />
          <TextField
            name="sort"
            label="Sort"
            type="number"
            value={row.sort}
            saveToDb={saveToDb}
            error={fieldErrors.sort}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
