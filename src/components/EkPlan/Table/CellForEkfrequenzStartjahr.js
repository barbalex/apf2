import React, { useContext, useCallback, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import styled from 'styled-components'

import storeContext from '../../../storeContext'
import { tpop } from '../../shared/fragments'
import setEkplans from './setEkplans'

const Container = styled.div`
  font-size: 0.75rem !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  padding: 2px 4px !important;
  padding-left: ${props =>
    props['data-firstchild'] ? '10px !important' : '2px'};
  border-left: solid hsla(70, 80%, 75%, 1) 1px;
  border-right: solid hsla(70, 80%, 75%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
  background: ${props =>
    props['data-clicked']
      ? 'rgb(255,211,167) !important'
      : props['data-isodd']
      ? 'rgb(255, 255, 252)'
      : 'unset'};
  &.tpop-hovered {
    background-color: hsla(45, 100%, 90%, 1);
  }
  &.column-hovered {
    background-color: hsla(45, 100%, 90%, 1);
  }
  div {
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }
  padding: 5px 15px !important;
  font-size: unset !important;
  border-left: solid green 1px;
  border-right: solid green 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:focus-within {
    border: solid orange 3px;
  }
`
const Input = styled.input`
  font-size: 12px;
  width: 100%;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
  &:focus {
    outline: none !important;
  }
`

const CellForEkfrequenz = ({ row, style }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const { hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''

  const [stateValue, setStateValue] = useState(
    row.ekfrequenzStartjahr.value || row.ekfrequenzStartjahr.value === 0
      ? row.ekfrequenzStartjahr.value
      : '',
  )

  useEffect(() => {
    setStateValue(
      !!row.ekfrequenzStartjahr.value || row.ekfrequenzStartjahr.value === 0
        ? row.ekfrequenzStartjahr.value
        : '',
    )
  }, [row.ekfrequenzStartjahr.value, row.id])

  const onMouseEnter = useCallback(() => hovered.setTpopId(row.id), [
    hovered,
    row.id,
  ])
  const onChange = useCallback(e => {
    const value = e.target.value || e.target.value === 0 ? e.target.value : ''
    setStateValue(value)
  }, [])
  const onBlur = useCallback(
    async e => {
      const value =
        e.target.value || e.target.value === 0 ? +e.target.value : null
      try {
        await client.mutate({
          mutation: gql`
            mutation updateTpop(
              $id: UUID!
              $ekfrequenzStartjahr: Int
              $changedBy: String
            ) {
              updateTpopById(
                input: {
                  id: $id
                  tpopPatch: {
                    id: $id
                    ekfrequenzStartjahr: $ekfrequenzStartjahr
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
            ekfrequenzStartjahr: value,
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopById: {
              tpop: {
                ...row.tpop,
                ekfrequenzStartjahr: value,
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
      if (row.ekfrequenz.value) {
        console.log('CellForEkfrequenzStartjahr, row:', row)
        setEkplans({
          tpopId: row.id,
          ekfrequenzCode: row.ekfrequenz.value,
          ekfrequenzStartjahr: value,
          client,
          store,
        })
      }
    },
    [client, enqueNotification, row, store],
  )

  return (
    <Container
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
      className={className}
      data-isodd={row.isOdd}
    >
      <Input value={stateValue} onChange={onChange} onBlur={onBlur} />
    </Container>
  )
}

export default observer(CellForEkfrequenz)
