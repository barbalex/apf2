import React, { useCallback, useContext, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'

import Select from '../../../../shared/Select'
import storeContext from '../../../../../storeContext'
import updateTpopkontrzaehlByIdGql from './updateTpopkontrzaehlById'
import ifIsNumericAsNumber from '../../../../../modules/ifIsNumericAsNumber'

const EinheitVal = styled.div`
  grid-area: einheitVal;
  > div {
    margin-top: -5px;
    padding-bottom: 0;
    @media print {
      margin-bottom: 0;
    }
  }
  @media print {
    input {
      font-size: 11px;
    }
  }
`
const Label = styled.div`
  font-weight: 700;
`
const EinheitLabel = styled(Label)`
  grid-area: einheitLabel;
  hyphens: auto;
  margin-top: 5px;
`

const Einheit = ({ nr, row, refetch, zaehleinheitWerte }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const queryClient = useQueryClient()

  const [error, setErrors] = useState(null)

  const onChange = useCallback(
    async (event) => {
      const val = ifIsNumericAsNumber(event.target.value)
      const variables = {
        id: row.id,
        anzahl: row.anzahl,
        methode: row.methode,
        einheit: val,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: updateTpopkontrzaehlByIdGql,
          variables,
        })
      } catch (error) {
        return setErrors(error.message)
      }
      refetch()
      queryClient.invalidateQueries({ queryKey: [`treeQuery`] })
    },
    [
      client,
      queryClient,
      refetch,
      row.anzahl,
      row.id,
      row.methode,
      store.user.name,
    ],
  )

  return (
    <>
      <EinheitLabel>{`Zähleinheit ${nr}`}</EinheitLabel>
      <EinheitVal>
        <Select
          value={row.einheit}
          label=""
          name="einheit"
          error={error}
          options={zaehleinheitWerte}
          saveToDb={onChange}
          noCaret
        />
      </EinheitVal>
    </>
  )
}

export default observer(Einheit)
