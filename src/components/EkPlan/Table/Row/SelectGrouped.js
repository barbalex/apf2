import React, { useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import { tpop } from '../../../shared/fragments'
import storeContext from '../../../../storeContext'

const Select = styled.select`
  width: 100%;
  height: 100% !important;
  background: transparent;
  border: none;
  border-collapse: collapse;
  font-size: 0.75rem;
  font-family: inherit;
  &:focus {
    outline-color: transparent;
  }
`
const Optgroup = styled.optgroup`
  font-family: inherit !important;
  font-size: 1rem;
`
const Option = styled.option`
  font-family: inherit !important;
  font-size: 1rem;
`

const SelectComponent = ({ optionsGrouped, row, val, field }) => {
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const client = useApolloClient()
  const [focused, setFocused] = useState(false)

  const onChange = useCallback(
    async e => {
      const value = e.target.value || null
      try {
        await client.mutate({
          mutation: gql`
            mutation updateTpop(
              $id: UUID!
              $${field}: String
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
    },
    [row.id],
  )
  const onFocus = useCallback(() => {
    setFocused(true)
  }, [])
  const onBlur = useCallback(() => {
    setFocused(false)
  }, [])

  return (
    <Select
      value={val.value || ''}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {focused ? (
        optionsGrouped ? (
          <>
            <Option key="option1" value={null}>
              {''}
            </Option>
            {Object.keys(optionsGrouped).map(key => (
              <Optgroup key={key} label={key}>
                {optionsGrouped[key].map(o => (
                  <Option key={o.value} value={o.value}>
                    {o.label}
                  </Option>
                ))}
              </Optgroup>
            ))}
          </>
        ) : null
      ) : (
        <Option key="option1" value={val.value || ''}>
          {val.value || ''}
        </Option>
      )}
    </Select>
  )
}

export default observer(SelectComponent)
