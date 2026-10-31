import { apiFetch } from '../../../../modules/api.ts'
import { popmassnberSelect } from '../../../../modules/selects.ts'
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
  PopmassnberId,
  PopId,
  ApId,
  TpopmassnErfbeurtWerteCode,
} from '../../../../models/apflora/index.ts'

import styles from './index.module.css'
import { apiUpdateByVariables } from '../../../../modules/api.ts'

interface PopmassnberQueryResult {
  popmassnberById?: {
    id: PopmassnberId
    popId: PopId
    jahr: number | null
    beurteilung: TpopmassnErfbeurtWerteCode | null
    bemerkungen: string | null
    tpopmassnErfbeurtWerteByBeurteilung?: {
      code: TpopmassnErfbeurtWerteCode
      text: string | null
      sort: number | null
    }
    popByPopId?: {
      id: PopId
      apId: ApId
    }
  }
  allTpopmassnErfbeurtWertes?: {
    nodes: {
      value: TpopmassnErfbeurtWerteCode
      label: string | null
    }[]
  }
}

export const popmassnberQueryOptions = (id: string | undefined) => ({
  queryKey: ['popmassnber', id],
  queryFn: async () => {
    const [rows, werte] = await Promise.all([
      apiFetch<NonNullable<PopmassnberQueryResult['popmassnberById']>[]>(
        `/v_popmassnber?id=eq.${id}&select=${popmassnberSelect},tpopmassnErfbeurtWerteByBeurteilung:tpopmassn_erfbeurt_werte_by_beurteilung,popByPopId:pop_by_pop_id`,
      ),
      apiFetch(
        `/tpopmassn_erfbeurt_werte?order=sort.asc&select=value:code,label:text`,
      ),
    ])
    return {
      popmassnberById: rows?.[0] ?? null,
      allTpopmassnErfbeurtWertes: { nodes: werte ?? [] },
    }
  },
})

export const Component = () => {
  const { popmassnberId: id } = useParams()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useSuspenseQuery(popmassnberQueryOptions(id))

  const row: Partial<NonNullable<PopmassnberQueryResult['popmassnberById']>> =
    data?.popmassnberById ?? {}
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
      await apiUpdateByVariables('popmassnber', variables)
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    // Invalidate queries to refetch data
    void tsQueryClient.invalidateQueries({
      queryKey: ['popmassnber', id],
    })
    if (['jahr', 'beurteilung'].includes(field)) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treePopmassnber`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Massnahmen-Bericht Population"
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
            name="beurteilung"
            label="Entwicklung"
            dataSource={
              (data?.allTpopmassnErfbeurtWertes?.nodes ?? []) as never[]
            }
            value={row.beurteilung as null}
            saveToDb={saveToDb}
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
