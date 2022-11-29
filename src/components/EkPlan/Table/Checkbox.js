import React, { useCallback, useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import styled from '@emotion/styled'

import { tpop } from '../../shared/fragments'
import storeContext from '../../../storeContext'

const CheckboxContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`
const StyledCheckbox = styled.div`
  width: 19px;
  height: 19px;
  background: ${(props) => (props.checked ? '#2e7d32' : 'rgba(46,125,50,0.1)')};
  border-radius: 3px;
  transition: all 150ms;
  margin: auto;

  ${Icon} {
    visibility: ${(props) => (props.checked ? 'visible' : 'hidden')};
  }
`

const CheckboxComponent = ({ row, value, field }) => {
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const client = useApolloClient()

  const [checked, setChecked] = useState(value === null ? false : value)
  useEffect(() => {
    setChecked(row[field] === true)
  }, [field, row, value])

  const onClick = useCallback(async () => {
    setChecked(!checked)
    try {
      await client.mutate({
        mutation: gql`
            mutation updateTpopCheckbox(
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
          [field]: !checked,
          changedBy: store.user.name,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateTpopById: {
            tpop: {
              ...row,
              [field]: !checked,
            },
            __typename: 'Tpop',
          },
        },
      })
    } catch (error) {
      setChecked(!checked)
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
  }, [checked, client, field, row, store.user.name, enqueNotification])

  return (
    <CheckboxContainer onClick={onClick}>
      <StyledCheckbox checked={checked}>
        <Icon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      </StyledCheckbox>
    </CheckboxContainer>
  )
}

export default observer(CheckboxComponent)
