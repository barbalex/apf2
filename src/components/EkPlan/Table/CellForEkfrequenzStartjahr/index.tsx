import { useContext, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'

import { MobxContext } from '../../../../mobxContext.ts'
import { tpop } from '../../../shared/fragments.ts'
import { setEkplans } from '../setEkplans/index.tsx'

import styles from './index.module.css'

const processChangeWorkerFactory = createWorkerFactory(
  () => import('./processChange.ts'),
)

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
      <div
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
        className={styles.container}
      >
        <input
          value={stateValue}
          onChange={onChange}
          onBlur={onBlur}
          className={styles.input}
        />
      </div>
    )
  },
)
