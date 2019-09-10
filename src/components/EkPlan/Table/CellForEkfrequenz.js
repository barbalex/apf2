import React, { useContext, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { observer } from 'mobx-react-lite'
import { useSnackbar } from 'notistack'

import { StyledCellForSelect } from './index'
import { tpop } from '../../shared/fragments'
import storeContext from '../../../storeContext'
import setEkplans from './setEkplans'

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
  font-family: 'Roboto Mono';
  font-size: 0.85rem;
`

const CellForEkfrequenz = ({ row, field, style, refetchTpop }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const { ekfOptionsGroupedPerAp, hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''

  const [focused, setFocused] = useState(false)
  const { closeSnackbar } = useSnackbar()

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
            mutation updateTpopEkfrequenz(
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
      /**
       * TODO:
       * set ekfrequenzStartjahr depending on last ek/ekf or ansiedlung?
       */
      if (row.ekfrequenzStartjahr.value) {
        console.log('CellForEkfrequenz, row:', row)
        setEkplans({
          tpopId: row.id,
          ekfrequenzCode: value,
          ekfrequenzStartjahr: row.ekfrequenzStartjahr.value,
          refetchTpop,
          client,
          store,
          closeSnackbar,
        })
      }
    },
    [row, client, store, enqueNotification, refetchTpop, closeSnackbar],
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
              {optionsGrouped.map(o => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
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
