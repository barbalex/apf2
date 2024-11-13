import { memo, useContext, useCallback, useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { useApolloClient, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import groupBy from 'lodash/groupBy'
import max from 'lodash/max'

import { StyledCellForSelect } from './index.jsx'
import { tpop } from '../../shared/fragments.js'
import { StoreContext } from '../../../storeContext.js'
import { setStartjahr } from './setStartjahr/index.jsx'
import { setEkplans } from './setEkplans/index.jsx'

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

export const CellForEkfrequenz = memo(
  observer(({ row, field, style, refetchTpop, ekfrequenzs }) => {
    const client = useApolloClient()
    const store = useContext(StoreContext)
    const { enqueNotification } = store
    const { hovered } = store.ekPlan
    const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''

    const ekfOptionsGroupedPerAp = useMemo(() => {
      const longestAnwendungsfall = max(
        ekfrequenzs.map((a) => (a.anwendungsfall || '').length),
      )
      const options = ekfrequenzs.map((o) => {
        const code = (o.code || '').padEnd(9, '\xA0')
        const anwendungsfall =
          `${(o.anwendungsfall || '').padEnd(longestAnwendungsfall, '\xA0')}` ||
          ''
        return {
          value: o.id,
          label: `${code}: ${anwendungsfall}`,
          anwendungsfall,
          apId: o.apId,
        }
      })
      const os = groupBy(options, 'apId')
      return os
    }, [ekfrequenzs])

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
          {focused ?
            optionsGrouped ?
              <>
                <Option
                  key="option1"
                  value={null}
                >
                  {''}
                </Option>
                {optionsGrouped.map((o) => (
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
              value={field.value}
            >
              {valueToShow}
            </Option>
          }
        </Select>
      </StyledCellForSelect>
    )
  }),
)
