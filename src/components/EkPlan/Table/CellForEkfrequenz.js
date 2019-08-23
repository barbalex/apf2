import React, { useContext, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { observer } from 'mobx-react-lite'

import { StyledCellForSelect } from './index'
import { tpop } from '../../shared/fragments'
import storeContext from '../../../storeContext'

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

const CellForEkfrequenz = ({ row, field, style }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const { ekfOptionsGroupedPerAp, hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''

  const [focused, setFocused] = useState(false)

  const onMouseEnter = useCallback(() => hovered.setTpopId(row.id), [
    hovered,
    row.id,
  ])
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
      // TODO: set ekplan and tell user it is happening
    },
    [client, enqueNotification, row.id, row.tpop, store.user.name],
  )
  const onFocus = useCallback(() => {
    setFocused(true)
  }, [])
  const onBlur = useCallback(() => {
    setFocused(false)
  }, [])
  const valueToShow = field.value || field.value === 0 ? field.value : ''
  const optionsGrouped = ekfOptionsGroupedPerAp[row.apId]

  return (
    <StyledCellForSelect
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
      data-isodd={row.isOdd}
    >
      <Select
        value={valueToShow}
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
          <Option key="option1" value={valueToShow}>
            {valueToShow}
          </Option>
        )}
      </Select>
    </StyledCellForSelect>
  )
}

export default observer(CellForEkfrequenz)
