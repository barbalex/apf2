import { memo, useContext, useCallback, useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import groupBy from 'lodash/groupBy'
import max from 'lodash/max'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'

import { StyledCellForSelect } from '../index.jsx'
import { MobxContext } from '../../../../mobxContext.js'

const processChangeWorkerFactory = createWorkerFactory(
  () => import('./processChange.js'),
)

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
  font-family: 'Roboto Mono', monospace;
  font-size: 0.85rem;
`

export const CellForEkfrequenz = memo(
  observer(
    ({ row, isOdd, field, width, setProcessing, data, rowContainerRef }) => {
      const client = useApolloClient()
      const store = useContext(MobxContext)
      const { enqueNotification } = store
      const { hovered, apValues } = store.ekPlan
      const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''

      const processChangeWorker = useWorker(processChangeWorkerFactory)

      const allEkfrequenzs = data?.allEkfrequenzs?.nodes ?? []

      const ekfOptions = useMemo(() => {
        const longestAnwendungsfall = max(
          allEkfrequenzs.map((a) => (a.anwendungsfall || '').length),
        )
        const longestCode = max(
          allEkfrequenzs.map((a) => (a.code || '').length),
        )
        const options = allEkfrequenzs
          .filter((e) => e.apId === row.apId)
          .map((o) => {
            const code = (o.code ?? '').padEnd(longestCode + 1, '\u00A0')
            return {
              id: o.id,
              code: o.code,
              count: longestCode,
              label: `${code}: ${o.anwendungsfall}`,
            }
          })

        return options
      }, [allEkfrequenzs])

      const [focused, setFocused] = useState(false)

      const onMouseEnter = useCallback(
        () => hovered.setTpopId(row.id),
        [hovered, row.id],
      )
      const onChange = useCallback(
        async (e) => {
          const value = e.target.value || null
          setProcessing(true)
          await processChangeWorker.processChange({
            client,
            value,
            row,
            enqueNotification,
            store,
          })
          setProcessing(false)
          setTimeout(() => {
            setFocused(false)
            rowContainerRef.current.focus()
          }, 300)
        },
        [row, client, store, enqueNotification],
      )
      const onFocus = useCallback(() => setFocused(true), [])
      const onBlur = useCallback(() => setFocused(false), [])

      const valueToShow = useMemo(
        () => allEkfrequenzs?.find((e) => e.id === field.value)?.code,
        [allEkfrequenzs, field.value],
      )

      return (
        <StyledCellForSelect
          width={width}
          onMouseEnter={onMouseEnter}
          onMouseLeave={hovered.reset}
          className={className}
          data-isodd={isOdd}
        >
          <Select
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            // prevent not being focused when clicking on select
            onClick={onFocus}
          >
            {/* <Option key="option1" value={null}>
            {''}
          </Option> */}
            {/* {ekfOptions.map((e) => (
            <Option
              key={e.id}
              value={e.id}
              selected={e.id === data?.tpopById?.ekfrequenz}
            >
              {e.cde}
            </Option>
          ))} */}
            {focused ? (
              ekfOptions ? (
                <>
                  <Option key="option1" value={null}>
                    {''}
                  </Option>
                  {ekfOptions.map((e) => (
                    <Option
                      key={e.id}
                      value={e.id}
                      selected={e.id === data?.tpopById?.ekfrequenz}
                    >
                      {e.label}
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
    },
  ),
)
