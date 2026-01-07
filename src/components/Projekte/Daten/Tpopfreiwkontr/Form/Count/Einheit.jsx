import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { Select } from '../../../../../shared/Select.jsx'
import { MobxContext } from '../../../../../../mobxContext.js'
import { updateTpopkontrzaehlById } from './updateTpopkontrzaehlById.js'
import { ifIsNumericAsNumber } from '../../../../../../modules/ifIsNumericAsNumber.js'

import { val, label } from './Einheit.module.css'

export const Einheit = observer(({ nr, row, refetch, zaehleinheitWerte }) => {
  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [error, setErrors] = useState(null)

  const onChange = async (event) => {
    const val = ifIsNumericAsNumber(event.target.value)
    const variables = {
      id: row.id,
      anzahl: row.anzahl,
      methode: row.methode,
      einheit: val,
      changedBy: store.user.name,
    }
    try {
      await apolloClient.mutate({
        mutation: updateTpopkontrzaehlById,
        variables,
      })
    } catch (error) {
      return setErrors(error.message)
    }
    refetch()
    tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfreiwkontrzaehl`],
    })
  }

  return (
    <>
      <div className={label}>{`Zähleinheit ${nr}`}</div>
      <div className={val}>
        <Select
          key={`${row?.id}einheit`}
          value={row.einheit}
          label=""
          name="einheit"
          error={error}
          options={zaehleinheitWerte}
          saveToDb={onChange}
          noCaret
        />
      </div>
    </>
  )
})
