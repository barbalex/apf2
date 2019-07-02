import React, { useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import { tpop } from '../shared/fragments'
import storeContext from '../../storeContext'

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

const EkfreqzenzSelect = ({ ekfO, row, val }) => {
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const client = useApolloClient()
  const [ekfrequenzFocused, setEkfrequenzFocused] = useState(false)

  const onChange = useCallback(
    async e => {
      const value = e.target.value || null
      try {
        await client.mutate({
          mutation: gql`
            mutation updateTpop(
              $id: UUID!
              $ekfrequenz: String
              $changedBy: String
            ) {
              updateTpopById(
                input: {
                  id: $id
                  tpopPatch: {
                    id: $id
                    ekfrequenz: $ekfrequenz
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
            ekfrequenz: value,
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopById: {
              tpop: {
                ...row.tpop,
                ekfrequenz: value,
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
    setEkfrequenzFocused(true)
  }, [])
  const onBlur = useCallback(() => {
    setEkfrequenzFocused(false)
  }, [])

  return (
    <Select
      value={val.value || ''}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {ekfrequenzFocused ? (
        ekfO[row.apId] ? (
          <>
            <Option key="ekfrequenzOption1" value={null}>
              {''}
            </Option>
            {Object.keys(ekfO[row.apId]).map(key => (
              <Optgroup key={key} label={key}>
                {ekfO[row.apId][key].map(o => (
                  <Option key={o.value} value={o.value}>
                    {o.label}
                  </Option>
                ))}
              </Optgroup>
            ))}
          </>
        ) : null
      ) : (
        <Option key="ekfrequenzOption1" value={val.value || ''}>
          {val.value || ''}
        </Option>
      )}
    </Select>
  )
}

export default observer(EkfreqzenzSelect)
