// seems not in use
import { memo, useState, useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import { tpop } from '../../shared/fragments.js'
import { MobxContext } from '../../../mobxContext.js'

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
const Option = styled.option`
  font-family: inherit !important;
  font-size: 1rem;
`

export const SelectComponent = memo(
  observer(({ options, row, val, field }) => {
    const store = useContext(MobxContext)
    const { enqueNotification } = store
    const client = useApolloClient()
    const [focused, setFocused] = useState(false)

    const onChange = useCallback(
      async (e) => {
        const value = e.target.value || null
        try {
          await client.mutate({
            mutation: gql`
            mutation updateTpopSelect(
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
            refetchQueries: ['EkplanTpopQuery'],
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
      [client, enqueNotification, field, row.id, store.user.name],
    )
    const onFocus = useCallback(() => {
      setFocused(true)
    }, [])
    const onBlur = useCallback(() => {
      setFocused(false)
    }, [])
    const valueToShow = val.value || val.value === 0 ? val.value : ''

    return (
      <Select
        value={valueToShow}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {focused ?
          options ?
            <>
              <Option
                key="option1"
                value={null}
              >
                {''}
              </Option>
              {options.map((o) => (
                <Option
                  key={o.value}
                  value={o.value}
                >
                  {o.label}
                </Option>
              ))}
            </>
          : null
        : <Option
            key="option1"
            value={valueToShow}
          >
            {valueToShow}
          </Option>
        }
      </Select>
    )
  }),
)
