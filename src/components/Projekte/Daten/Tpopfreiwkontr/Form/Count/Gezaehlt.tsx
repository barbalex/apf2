import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../../../shared/TextField.jsx'
import { MobxContext } from '../../../../../../mobxContext.js'
import { updateTpopkontrzaehlById } from './updateTpopkontrzaehlById.js'
import { ifIsNumericAsNumber } from '../../../../../../modules/ifIsNumericAsNumber.js'

interface GezaehltProps {
  row: any
  refetch: () => void
}

export const Gezaehlt = observer(({ row, refetch }: GezaehltProps) => {
  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [errors, setErrors] = useState<Record<string, string>>({})

  const onChange = async (event) => {
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
      value={row.methode === 2 ? row.anzahl : null}
      label=""
      name="anzahl"
      type="number"
      saveToDb={onChange}
      errors={errors}
    />
  )
})
