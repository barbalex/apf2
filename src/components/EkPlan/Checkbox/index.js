import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import { tpop } from '../../shared/fragments'
import storeContext from '../../../storeContext'
import Checkbox from './Checkbox'

const CheckboxComponent = ({ row, field }) => {
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const client = useApolloClient()

  const value = row.tpop[field]

  const onClick = useCallback(async () => {
    try {
      await client.mutate({
        mutation: gql`
            mutation updateTpop(
              $id: UUID!
              $${field}: Boolean
              $changedBy: String
            ) {
              updateTpopById(
                input: {
                  id: $id
                  tpopPatch: {
                    id: $id
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpop {
                  ...TpopFields
                }
              }
            }
            ${tpop}
          `,
        variables: {
          id: row.id,
          [field]: value,
          changedBy: store.user.name,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTpopById: {
            tpop: {
              ...row.tpop,
              [field]: value,
            },
            __typename: 'Tpop',
          },
        },
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
  }, [row.id])

  return <Checkbox checked={value} onClick={onClick} />
}

export default observer(CheckboxComponent)
