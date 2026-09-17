import { useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../../../shared/TextField.tsx'
import { userNameAtom } from '../../../../../../store/index.ts'
import { updateTpopkontrzaehlById } from './updateTpopkontrzaehlById.ts'
import { ifIsNumericAsNumber } from '../../../../../../modules/ifIsNumericAsNumber.ts'
import type { TpopkontrzaehlRow } from './index.tsx'

interface GezaehltProps {
  row: Partial<TpopkontrzaehlRow>
  refetch: () => void
}

export const Gezaehlt = ({ row, refetch }: GezaehltProps) => {
  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [, setErrors] = useState<Record<string, string>>({})

  const onChange = async (event: {
    target: {
      name?: string
      value: string | number | boolean | null
    }
  }) => {
    const val = ifIsNumericAsNumber(event.target.value)
    if (val === null && row.methode === 1) return
    if (row.anzahl === val && row.methode === 2) return
    const variables = {
      id: row.id,
      anzahl: val,
      methode: 2,
      einheit: row.einheit,
      changedBy: userName,
    }
    try {
      await apolloClient.mutate({
        mutation: updateTpopkontrzaehlById,
        variables,
      })
    } catch (error) {
      return setErrors({ anzahl: (error as Error).message })
    }
    refetch()
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontrzaehl`],
    })
  }

  return (
    <TextField
      value={row.methode === 2 ? row.anzahl : null}
      label=""
      error={undefined}
      name="anzahl"
      type="number"
      saveToDb={onChange}
    />
  )
}
