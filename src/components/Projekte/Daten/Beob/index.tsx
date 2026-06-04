import { useEffect, Suspense } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useQuery } from '@tanstack/react-query'
import { arrayMoveImmutable } from 'array-move'
import { useAtomValue, useSetAtom } from 'jotai'

import { exists } from '../../../../modules/exists.ts'
import { query } from './query.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Field as BeobField } from './Field.tsx'
import {
  sortedBeobFieldsAtom,
  setSortedBeobFieldsAtom,
} from '../../../../store/index.ts'

import type BeobType from '../../../../models/apflora/Beob.ts'

import styles from './index.module.css'

interface BeobQueryResult {
  data?: {
    beobById: BeobType
  }
}

export const Beob = () => {
  const { beobId: id } = useParams<{ beobId: string }>()

  const sortedBeobFieldsPassed = useAtomValue(sortedBeobFieldsAtom)
  const setSortedBeobFields = useSetAtom(setSortedBeobFieldsAtom)
  const sortedBeobFields = sortedBeobFieldsPassed.slice()

  const apolloClient = useApolloClient()

  const sortFn = (a: [string, any], b: [string, any]) => {
    const keyA = a[0]
    const keyB = b[0]
    const indexOfA = sortedBeobFields.indexOf(keyA)
    const indexOfB = sortedBeobFields.indexOf(keyB)
    const sortByA = indexOfA > -1
    const sortByB = indexOfB > -1

    if (sortByA && sortByB) {
      return sortedBeobFields.indexOf(keyA) - sortedBeobFields.indexOf(keyB)
    }
    // if (sortByA || sortByB) {
    //   return 1
    // }
    if (keyA?.toLowerCase?.() > keyB?.toLowerCase?.()) return 1
    if (keyA?.toLowerCase?.() < keyB?.toLowerCase?.()) return -1
    return 0
  }

  const { data, error } = useQuery<BeobQueryResult>({
    queryKey: ['beobByIdQueryForBeob', id],
    queryFn: async () =>
      apolloClient.query({
        query,
        variables: {
          id,
        },
      }),
  })

  const row = data?.data?.beobById ?? {}
  const rowData = row.data ? JSON.parse(row.data) : {}
  const fields = Object.entries(rowData)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    .filter(([key, value]) => exists(value))
    .sort(sortFn)
  const keys = fields.map((f) => f[0])

  useEffect(() => {
    // add missing keys to sortedBeobFields
    const additionalKeys = []
    for (const key of keys) {
      if (!sortedBeobFields.includes(key)) {
        additionalKeys.push(key)
      }
    }
    if (!additionalKeys.length) return
    setSortedBeobFields([...sortedBeobFields, ...additionalKeys])
  }, [keys, setSortedBeobFields, sortedBeobFields])

  const moveField = (dragIndex: number, hoverIndex: number) => {
    // get item from keys
    const itemBeingDragged = keys[dragIndex]
    const itemBeingHovered = keys[hoverIndex]
    // move from dragIndex to hoverIndex
    // in sortedBeobFields
    const fromIndex = sortedBeobFields.indexOf(itemBeingDragged)
    const toIndex = sortedBeobFields.indexOf(itemBeingHovered)
    // catch some edge cases
    if (fromIndex === toIndex) return
    if (fromIndex === -1) return
    if (toIndex === -1) return
    // move
    const newArray = arrayMoveImmutable(sortedBeobFields, fromIndex, toIndex)
    setSortedBeobFields(newArray)
  }

  const renderField = (field: [string, any], index: number) => (
    <BeobField
      key={field[0]}
      label={field[0]}
      value={field[1]}
      index={index}
      moveField={moveField}
    />
  )

  if (error) return <Error error={error} />

  // Issue: only one instance of HTML5Backend can be used at a time
  // https://github.com/react-dnd/react-dnd/issues/3178
  // Solution: use the same instance for all components
  // NEW: alternative solution: https://github.com/react-dnd/react-dnd/issues/3257#issuecomment-1239254032
  return (
    <ErrorBoundary>
      <div className={styles.outerContainer}>
        <p className={styles.explainer}>
          Die Felder können beliebig sortiert werden (drag and drop).
        </p>
        <div className={styles.container}>
          <Suspense fallback={<Spinner />}>
            <DndProvider
              backend={HTML5Backend}
              context={window}
            >
              {fields.map((field, i) => renderField(field, i))}
            </DndProvider>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  )
}
