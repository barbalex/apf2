/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useContext, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../../../shared/TextField.jsx'
import { MobxContext } from '../../../../../../mobxContext.js'
import { updateTpopkontrzaehlById } from './updateTpopkontrzaehlById.js'
import { ifIsNumericAsNumber } from '../../../../../../modules/ifIsNumericAsNumber.js'

export const Gezaehlt = memo(
  observer(({ row, refetch }) => {
    const store = useContext(MobxContext)
    const client = useApolloClient()
    const tsQueryClient = useQueryClient()

    const [errors, setErrors] = useState({})

    const onChange = useCallback(
      async (event) => {
        const val = ifIsNumericAsNumber(event.target.value)
        if (val === null && row.methode === 1) return
        if (row.anzahl === val && row.methode === 2) return
        const variables = {
          id: row.id,
          anzahl: val,
          methode: 2,
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
        tsQueryClient.invalidateQueries({
          queryKey: [`treeTpopfreiwkontrzaehl`],
        })
      },
      [
        client,
        refetch,
        row.anzahl,
        row.einheit,
        row.id,
        row.methode,
        store.refetch,
        store.user.name,
        store.tree,
        tsQueryClient,
      ],
    )
    //console.log('Gezaehlt, row:', row)

    return (
      <TextField
        value={row.methode === 2 ? row.anzahl : null}
        label=""
        name="anzahl"
        type="number"
        saveToDb={onChange}
        errors={errors}
      />
    )
  }),
)
