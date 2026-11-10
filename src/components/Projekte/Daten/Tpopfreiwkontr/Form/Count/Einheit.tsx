import { apiUpdateByVariables } from '../../../../../../modules/api.ts'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Select } from '../../../../../shared/Select.tsx'
import { userNameAtom } from '../../../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../../../modules/ifIsNumericAsNumber.ts'
import { updateTpopkontrzaehlInCaches } from '../../../../../../modules/updateTpopkontrzaehlInCaches.ts'
import type { TpopkontrzaehlRow } from './index.tsx'

import styles from './Einheit.module.css'

interface EinheitProps {
  nr: string
  row: Partial<TpopkontrzaehlRow>
  zaehleinheitWerte: { value: number; label: string }[]
}

export const Einheit = ({
  nr,
  row,
  zaehleinheitWerte,
}: EinheitProps) => {
  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const [error, setErrors] = useState<string | null>(null)

  const onChange = async (event: {
    target: {
      name?: string | undefined
      value: string | number | boolean | number[] | null
    }
  }) => {
    if (!row.id) return
    // options carry numeric codes; anything else clears the field
    const val = ifIsNumericAsNumber(event.target.value)
    const einheit = typeof val === 'number' ? val : null
    const anzahl = row.anzahl ?? null
    const methode = row.methode ?? null
    try {
      await apiUpdateByVariables('tpopkontrzaehl', {
        id: row.id,
        anzahl,
        methode,
        einheit,
        changedBy: userName,
      })
    } catch (error) {
      return setErrors((error as Error).message)
    }
    setErrors(null)
    // the patch is the row's new state — update the caches, no refetch (#837)
    updateTpopkontrzaehlInCaches({
      tsQueryClient,
      row: { id: row.id, anzahl, methode, einheit },
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontrzaehl`],
    })
  }

  return (
    <>
      <div className={styles.label}>{`Zähleinheit ${nr}`}</div>
      <div className={styles.val}>
        <Select
          key={`${row?.id}einheit`}
          value={row.einheit ?? null}
          label=""
          name="einheit"
          error={error ?? ''}
          options={zaehleinheitWerte}
          saveToDb={(event) => void onChange(event)}
          noCaret
        />
      </div>
    </>
  )
}
