import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'

import { exists } from '../../../../modules/exists.ts'
import { apiFetch } from '../../../../modules/api.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Field as BeobField } from './Field.tsx'
import {
  sortedBeobFieldsAtom,
  setSortedBeobFieldsAtom,
} from '../../../../store/index.ts'

import styles from './index.module.css'

export const beobQueryOptions = (id: string | undefined) => ({
  queryKey: ['beobByIdQueryForBeob', id],
  queryFn: async () => {
    // data is the raw InfoFlora/EVK jsonb blob — PostgREST delivers it
    // as an object, the old GraphQL scalar needed JSON.parse
    const rows = await apiFetch<{ data: Record<string, ReactNode> | null }[]>(
      `/beob?id=eq.${id}&select=data`,
    )
    return { beobById: rows?.[0] ?? null }
  },
})

export const Beob = () => {
  const { beobId: id } = useParams<{ beobId: string }>()

  const sortedBeobFieldsPassed = useAtomValue(sortedBeobFieldsAtom)
  const setSortedBeobFields = useSetAtom(setSortedBeobFieldsAtom)
  const sortedBeobFields = sortedBeobFieldsPassed.slice()

  const sortFn = (a: [string, ReactNode], b: [string, ReactNode]) => {
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

  const { data, error } = useQuery(beobQueryOptions(id))

  const rowData: Record<string, ReactNode> = data?.beobById?.data ?? {}
  const fields = Object.entries(rowData)
    .filter(([, value]) => exists(value))
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

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const fromIndex = sortedBeobFields.indexOf(String(active.id))
    const toIndex = sortedBeobFields.indexOf(String(over.id))
    if (fromIndex === -1 || toIndex === -1) return
    setSortedBeobFields(arrayMove(sortedBeobFields, fromIndex, toIndex))
  }

  // distance: 5 keeps links inside the values clickable — a plain click
  // never starts a drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={styles.outerContainer}>
        <p className={styles.explainer}>
          Die Felder können beliebig sortiert werden (drag and drop).
        </p>
        <div className={styles.container}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={keys}
              strategy={verticalListSortingStrategy}
            >
              {fields.map(([key, value]) => (
                <BeobField
                  key={key}
                  id={key}
                  label={key}
                  value={value}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </ErrorBoundary>
  )
}
