import { useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../../../shared/TextField.tsx'
import { userNameAtom } from '../../../../../../store/index.ts'
import { updateTpopkontrzaehlById } from './updateTpopkontrzaehlById.ts'
import { ifIsNumericAsNumber } from '../../../../../../modules/ifIsNumericAsNumber.ts'

interface GeschaetztProps {
  row: any
  refetch: () => void
}

export const Geschaetzt = ({ row, refetch }: GeschaetztProps) => {
  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [errors, setErrors] = useState<Record<string, string>>({})

  const onChange = async (event) => {
    const val = ifIsNumericAsNumber(event.target.value)
    /*console.log('Geschaetzt, onChange:', {
        row,
        val,
        targetValue: event.target.value,
      })*/
    if (val === null && row.methode === 2) return
    if (row.anzahl === val && row.methode === 1) return
    const variables = {
      id: row.id,
      anzahl: val,
      methode: 1,
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
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontrzaehl`],
    })
  }

  return (
    <TextField
      value={row.methode === 1 ? row.anzahl : null}
      label=""
      name="anzahl"
      type="number"
      saveToDb={onChange}
      errors={errors}
    />
  )
}
