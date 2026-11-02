import { apiFetch } from '../../../../modules/api.ts'
import { popSelect } from '../../../../modules/selects.ts'
import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState } from 'react'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { TextFieldWithInfo } from '../../../shared/TextFieldWithInfo.tsx'
import { Status } from '../../../shared/Status.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { Coordinates } from '../../../shared/Coordinates.tsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { Menu } from './Menu.tsx'

import styles from './Pop.module.css'
import { apiUpdateByVariables } from '../../../../modules/api.ts'

// field list of the former PopFields graphql fragment; v_pop serves
// these columns (selects.ts builds the keys)
interface PopFields {
  id: string
  label: string | null
  apId: string | null
  nr: number | null
  name: string | null
  status: number | null
  statusUnklar: boolean | null
  statusUnklarBegruendung: string | null
  bekanntSeit: number | null
  lv95X: number | null
  wgs84Lat: number | null
  lv95Y: number | null
  wgs84Long: number | null
  changedBy: string | null
  geomPoint: { geojson: unknown; x: number; y: number } | null
}

interface PopQueryResult {
  popById?: PopFields & {
    apByApId?: {
      id: string
      startJahr: number | null
    }
  }
}

export const popQueryOptions = (id: string | undefined) => ({
  queryKey: ['pop', id],
  queryFn: async () => {
    // v_pop provides the computed columns (label, coordinates) and
    // the ap relation as a jsonb column (selects.ts builds the keys)
    const rows = await apiFetch<NonNullable<PopQueryResult['popById']>[]>(
      `/v_pop?id=eq.${id}&select=${popSelect},apByApId:ap_by_ap_id`,
    )
    return rows?.[0] ?? null
  },
})

export const Component = () => {
  const { popId } = useParams()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useSuspenseQuery(popQueryOptions(popId))

  const row: Partial<NonNullable<PopQueryResult['popById']>> = data ?? {}

  const refetchForm = () => {
    void tsQueryClient.invalidateQueries({
      queryKey: ['pop', popId],
    })
  }

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
      await apiUpdateByVariables('pop', variables)
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // update pop on map
    if (
      (value &&
        row &&
        ((field === 'lv95Y' && row.lv95X) ||
          (field === 'lv95X' && row.lv95Y))) ||
      (!value && (field === 'lv95Y' || field === 'lv95X'))
    ) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`PopForMapQuery`],
      })
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    // Invalidate queries to refetch data
    void tsQueryClient.invalidateQueries({
      queryKey: ['pop', popId],
    })
    if (['name', 'nr'].includes(field)) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treePop`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <FormTitle
        title="Population"
        MenuBarComponent={Menu}
        menuBarProps={{ row }}
      />
      <div className={styles.formContainer}>
        <TextField
          label="Nr."
          name="nr"
          type="number"
          value={row.nr}
          saveToDb={saveToDb}
          error={fieldErrors.nr}
        />
        <TextFieldWithInfo
          label="Name"
          name="name"
          type="text"
          popover="Dieses Feld möglichst immer ausfüllen"
          value={row.name}
          saveToDb={saveToDb}
          error={fieldErrors.name}
        />
        <Status
          apJahr={row?.apByApId?.startJahr as null | undefined}
          showFilter={false}
          row={row}
          saveToDb={saveToDb}
          errors={fieldErrors}
        />
        <Checkbox2States
          label="Status unklar"
          name="statusUnklar"
          value={row.statusUnklar}
          saveToDb={saveToDb}
          error={fieldErrors.statusUnklar}
          helperText=""
        />
        <TextField
          label="Begründung"
          name="statusUnklarBegruendung"
          type="text"
          multiLine
          value={row.statusUnklarBegruendung}
          saveToDb={saveToDb}
          error={fieldErrors.statusUnklarBegruendung}
        />
        <Coordinates
          row={row}
          refetchForm={refetchForm}
          table="pop"
        />
      </div>
    </ErrorBoundary>
  )
}
