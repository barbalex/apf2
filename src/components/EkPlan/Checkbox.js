import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import styled from 'styled-components'

import { tpop } from '../shared/fragments'
import storeContext from '../../storeContext'

const CheckboxContainer = styled.div`
  width: 100%;
  height: 100%;
`

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`
const StyledCheckbox = styled.div`
  width: 19px;
  height: 19px;
  background: ${props => (props.checked ? '#2e7d32' : 'rgba(46,125,50,0.1)')};
  border-radius: 3px;
  transition: all 150ms;
  margin-left: auto;
  margin-right: auto;

  ${Icon} {
    visibility: ${props => (props.checked ? 'visible' : 'hidden')};
  }
`

const CheckboxComponent = ({ row, value, field }) => {
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const client = useApolloClient()

  const onClick = useCallback(async () => {
    console.log('Checkbox, onClick, newValue:', !value)
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
          [field]: !value,
          changedBy: store.user.name,
        },
        /*optimisticResponse: {
          __typename: 'Mutation',
          updateTpopById: {
            tpop: {
              ...row,
              [field]: !value,
            },
            __typename: 'Tpop',
          },
        },*/
      })
    } catch (error) {
      console.log('Checkbox, onClick, error:', error)
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
  }, [row.id])

  return (
    <CheckboxContainer onClick={onClick}>
      <StyledCheckbox checked={value}>
        <Icon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      </StyledCheckbox>
    </CheckboxContainer>
  )
}

export default observer(CheckboxComponent)
