import { useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Select } from '../../../../../shared/Select.tsx'
import { userNameAtom } from '../../../../../../store/index.ts'
import { updateTpopkontrzaehlById } from './updateTpopkontrzaehlById.ts'
import { ifIsNumericAsNumber } from '../../../../../../modules/ifIsNumericAsNumber.ts'
import type { TpopkontrzaehlRow } from './index.tsx'

import styles from './Einheit.module.css'

interface EinheitProps {
  nr: string
  row: Partial<TpopkontrzaehlRow>
  refetch: () => void
  zaehleinheitWerte: { value: number; label: string }[]
}

export const Einheit = ({
  nr,
  row,
  refetch,
  zaehleinheitWerte,
}: EinheitProps) => {
  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [error, setErrors] = useState<string | null>(null)

  const onChange = async (event: {
    target: {
      name?: string
      value: string | number | null
    }
  }) => {
    const val = ifIsNumericAsNumber(event.target.value)
    const variables = {
      id: row.id,
      anzahl: row.anzahl,
      methode: row.methode,
      einheit: val,
      changedBy: userName,
    }
    try {
      await apolloClient.mutate({
        mutation: updateTpopkontrzaehlById,
        variables,
      })
    } catch (error) {
      return setErrors((error as Error).message)
    }
    refetch()
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
