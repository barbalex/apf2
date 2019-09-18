import React, { useContext, useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/react-hooks'

import TextField from '../../../../shared/TextField'
import storeContext from '../../../../../storeContext'
import updateTpopkontrzaehlByIdGql from './updateTpopkontrzaehlById'
import ifIsNumericAsNumber from '../../../../../modules/ifIsNumericAsNumber'

const Geschaetzt = ({ row, refetch }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()

  const [errors, setErrors] = useState({})

  const onChange = useCallback(
    async event => {
      const val = ifIsNumericAsNumber(event.target.value)
      if (val === null && row.methode === 2) return
      if (row.anzahl === val) return
      const variables = {
        id: row.id,
        anzahl: val,
        methode: 1,
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
      store.refetch.tpopkontrzaehls()
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

export default observer(Geschaetzt)
