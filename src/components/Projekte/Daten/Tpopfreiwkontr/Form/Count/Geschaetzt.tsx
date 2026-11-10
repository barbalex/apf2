import { apiUpdateByVariables } from '../../../../../../modules/api.ts'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../../../shared/TextField.tsx'
import { userNameAtom } from '../../../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../../../modules/ifIsNumericAsNumber.ts'
import { updateTpopkontrzaehlInCaches } from '../../../../../../modules/updateTpopkontrzaehlInCaches.ts'
import type { TpopkontrzaehlRow } from './index.tsx'

interface GeschaetztProps {
  row: Partial<TpopkontrzaehlRow>
}

export const Geschaetzt = ({ row }: GeschaetztProps) => {
  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const [errors, setErrors] = useState<Record<string, string>>({})

  const onChange = async (event: {
    target: {
      name?: string
      value: string | number | boolean | null
    }
  }) => {
    if (!row.id) return
    const val = ifIsNumericAsNumber(event.target.value)
    const anzahl = typeof val === 'number' ? val : null
    if (anzahl === null && row.methode === 2) return
    if (row.anzahl === anzahl && row.methode === 1) return
    const einheit = row.einheit ?? null
    try {
      await apiUpdateByVariables('tpopkontrzaehl', {
        id: row.id,
        anzahl,
        methode: 1,
        einheit,
        changedBy: userName,
      })
    } catch (error) {
      // #837: a failed save must show, not silently keep the typed value
      return setErrors({ anzahl: (error as Error).message })
    }
    setErrors({})
    // the patch is the row's new state — update the caches, no refetch (#837)
    updateTpopkontrzaehlInCaches({
      tsQueryClient,
      row: { id: row.id, anzahl, methode: 1, einheit },
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontrzaehl`],
    })
  }

  return (
    <TextField
      value={row.methode === 1 ? row.anzahl : null}
      label=""
      error={errors.anzahl}
      name="anzahl"
      type="number"
      saveToDb={onChange}
    />
  )
}
