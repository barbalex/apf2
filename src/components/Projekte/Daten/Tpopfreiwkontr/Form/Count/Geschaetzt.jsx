import { memo, useContext, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../../../shared/TextField.jsx'
import { MobxContext } from '../../../../../../mobxContext.js'
import { updateTpopkontrzaehlById } from './updateTpopkontrzaehlById.js'
import { ifIsNumericAsNumber } from '../../../../../../modules/ifIsNumericAsNumber.js'

export const Geschaetzt = memo(
  observer(({ row, refetch }) => {
    const store = useContext(MobxContext)
    const client = useApolloClient()
    const queryClient = useQueryClient()

    const [errors, setErrors] = useState({})

    const onChange = useCallback(
      async (event) => {
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
          changedBy: store.user.name,
        }
        try {
          await client.mutate({
            mutation: updateTpopkontrzaehlById,
            variables,
          })
        } catch (error) {
          return setErrors({ anzahl: error.message })
        }
        refetch()
        queryClient.invalidateQueries({
          queryKey: [`treeTpopfreiwkontrzaehl`],
        })
      },
      [
        client,
        queryClient,
        refetch,
        row.anzahl,
        row.einheit,
        row.id,
        row.methode,
        store.user.name,
      ],
    )
    //console.log('Geschaetzt, row:', row)

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
  }),
)
