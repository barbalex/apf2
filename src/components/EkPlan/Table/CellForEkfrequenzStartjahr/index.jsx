import { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import styled from '@emotion/styled'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'

import { MobxContext } from '../../../../mobxContext.js'
import { tpop } from '../../../shared/fragments.js'
import { setEkplans } from '../setEkplans/index.jsx'

const processChangeWorkerFactory = createWorkerFactory(
  () => import('./processChange.js'),
)

const Container = styled.div`
  font-size: 0.75rem !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  padding: 2px 4px !important;
  padding-left: '2px';
  border-left: solid hsla(70, 80%, 75%, 1) 1px;
  border-right: solid hsla(70, 80%, 75%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
  box-sizing: border-box;
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
  height: 60px;
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

export const CellForEkfrequenzStartjahr = observer(
  ({ row, isOdd, width, setProcessing, ekfrequenzStartjahr, ekfrequenz }) => {
    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()

    const store = useContext(MobxContext)
    const { enqueNotification } = store
    const { hovered } = store.ekPlan
    const isHovered = hovered.tpopId === row.id

    const processChangeWorker = useWorker(processChangeWorkerFactory)

    const [stateValue, setStateValue] = useState(ekfrequenzStartjahr ?? '')
    useEffect(
      () => setStateValue(ekfrequenzStartjahr ?? ''),
      [ekfrequenzStartjahr],
    )

    const onMouseEnter = () => hovered.setTpopId(row.id)

    const onChange = (e) => {
      const value = e.target.value || e.target.value === 0 ? e.target.value : ''
      setStateValue(value)
    }

    const onBlur = async (e) => {
      const value =
        e.target.value || e.target.value === 0 ? +e.target.value : null
      setProcessing(true)
      await processChangeWorker.processChange({
        apolloClient,
        value,
        ekfrequenz,
        row,
        enqueNotification,
        store,
        tsQueryClient,
      })
      setProcessing(false)
    }

    return (
      <Container
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        style={{
          minWidth: width,
          maxWidth: width,
          backgroundColor:
            isHovered ? 'hsla(45, 100%, 90%, 1)'
            : isOdd ? 'rgb(255, 255, 252)'
            : 'unset',
        }}
      >
        <Input
          value={stateValue}
          onChange={onChange}
          onBlur={onBlur}
        />
      </Container>
    )
  },
)
