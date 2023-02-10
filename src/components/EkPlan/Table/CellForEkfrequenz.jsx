import React, { useContext, useCallback, useState } from 'react'
import styled from '@emotion/styled'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { StyledCellForSelect } from './index'
import { tpop } from '../../shared/fragments'
import storeContext from '../../../storeContext'
import setStartjahr from './setStartjahr'
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

const CellForEkfrequenz = ({ row, field, style, refetchTpop, ekfrequenzs }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const { ekfOptionsGroupedPerAp, hovered } = store.ekPlan
  const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''

  const [focused, setFocused] = useState(false)

  const onMouseEnter = useCallback(
    () => hovered.setTpopId(row.id),
    [hovered, row.id],
  )
  const onChange = useCallback(
    async (e) => {
      const value = e.target.value || null
      try {
        await client.mutate({
          mutation: gql`
            mutation updateTpopEkfrequenz(
              $id: UUID!
              $ekfrequenz: UUID
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
      // set EK-Frequenz Startjahr
      let ekfrequenzStartjahr
      if (value) {
        ekfrequenzStartjahr = await setStartjahr({
          row,
          ekfrequenz: value,
          client,
          store,
        })
      }
      // set ekplans if startjahr exists
      // TODO: or ekfrequenz has no kontrolljahre
      if (!!ekfrequenzStartjahr && !!value) {
        setEkplans({
          tpopId: row.id,
          ekfrequenz: value,
          ekfrequenzStartjahr,
          refetchTpop,
          client,
          store,
        })
      }
    },
    [row, client, store, enqueNotification, refetchTpop],
  )
  const onFocus = useCallback(() => {
    setFocused(true)
  }, [])
  const onBlur = useCallback(() => {
    setFocused(false)
  }, [])
  const optionsGrouped = ekfOptionsGroupedPerAp[row.apId]
  const ekfrequenz = ekfrequenzs.find((f) => f.id === field.value)
  const valueToShow = ekfrequenz ? ekfrequenz.code : ''

  /*focused &&
    console.log('CellForEkfrequenz', {
      focused,
      optionsGrouped,
      valueToShow,
      ekfOptionsGroupedPerAp,
    })*/

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
              {optionsGrouped.map((o) => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </>
          ) : null
        ) : (
          <Option key="option1" value={field.value}>
            {valueToShow}
          </Option>
        )}
      </Select>
    </StyledCellForSelect>
  )
}

export default observer(CellForEkfrequenz)
