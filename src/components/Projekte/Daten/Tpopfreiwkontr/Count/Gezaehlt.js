/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'

import TextField from '../../../../shared/TextField'
import storeContext from '../../../../../storeContext'
import updateTpopkontrzaehlByIdGql from './updateTpopkontrzaehlById'
import ifIsNumericAsNumber from '../../../../../modules/ifIsNumericAsNumber'

const Gezaehlt = ({ row, refetch }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()

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
          mutation: updateTpopkontrzaehlByIdGql,
          variables,
        })
      } catch (error) {
        return setErrors({ anzahl: error.message })
      }
      refetch()
      !!store && store.refetch && store.refetch.tree && store.refetch.tree()
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
}

export default observer(Gezaehlt)
