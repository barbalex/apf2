import { useEffect } from 'react'
import type { ReactNode } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
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
import { apiFetch } from '../../../../../modules/api.ts'

import { exists } from '../../../../../modules/exists.ts'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../../shared/Error.tsx'
import { Spinner } from '../../../../shared/Spinner.tsx'
import { Field } from './Field.tsx'
import {
  sortedBeobFieldsAtom,
  setSortedBeobFieldsAtom,
  mapBeobDetailsOpenAtom,
  setMapBeobDetailsOpenAtom,
} from '../../../../../store/index.ts'

import type { BeobId } from '../../../../../models/apflora/index.ts'

import markerStyles from '../BeobNichtBeurteilt/Marker.module.css'
import styles from './index.module.css'

interface BeobRow {
  id: BeobId
  data: Record<string, ReactNode> | null
  absenz: boolean | null
}

interface BeobByIdQueryResult {
  beobById: BeobRow | null
}

interface DataProps {
  id: BeobId
}

const topFieldNames = [
  'PRESENCE',
  'presence',
  'XY_PRECISION',
  'xy_radius',
  'locality_descript',
]

export const Data = ({ id }: DataProps) => {
  const sortedBeobFieldsPassed = useAtomValue(sortedBeobFieldsAtom)
  const setSortedBeobFields = useSetAtom(setSortedBeobFieldsAtom)

  const beobDetailsOpen = useAtomValue(mapBeobDetailsOpenAtom)
  const setBeobDetailsOpen = useSetAtom(setMapBeobDetailsOpenAtom)
  const onClickDetails = () => setBeobDetailsOpen(!beobDetailsOpen)

  // use existing sorting if available and no own has been set yet
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

  const { data, isLoading, error } = useQuery({
    queryKey: ['beobByIdQueryForBeob', id],
    queryFn: async () => {
      // phase 5: the raw InfoFlora/EVK jsonb blob arrives as an object
      const rows =
        (await apiFetch<{ data: Record<string, ReactNode> | null }[]>(
          `/beob?id=eq.${id}&select=data`,
        )) ?? []
      return {
        beobById: rows[0] ?? null,
      } as unknown as BeobByIdQueryResult
    },
  })

  const row = data?.beobById ?? null
  const rowData: Record<string, ReactNode> = row?.data ?? {}

  const topFields = Object.entries(rowData)
    .filter(([, value]) => exists(value))
    .filter(([key]) => topFieldNames.includes(key))
    .sort(sortFn)

  const fields = Object.entries(rowData)
    .filter(([, value]) => exists(value))
    .sort(sortFn)
  const keys = fields.map((f) => f[0])

  useEffect(() => {
    // add missing keys to sortedBeobFields
    const additionalKeys: string[] = []
    for (const key of keys) {
      if (!sortedBeobFields.includes(key)) {
        additionalKeys.push(key)
      }
    }
    if (!additionalKeys.length) return
    setSortedBeobFields([...sortedBeobFields, ...additionalKeys])
    // console.log('Beob, useEffect, adding additional keys: ', additionalKeys)
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

  if (!row) return null
  if (!fields || fields.length === 0) return null
  if (isLoading) return <Spinner />
  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      {!!topFields.length && (
        <div className={styles.topFieldsContainer}>
          <div className={markerStyles.info}>
            {topFields.map(([key, value]) => {
              const isAbsenz =
                key?.toLowerCase?.()?.includes?.('presence') && row?.absenz

              return (
                <div
                  key={key}
                  className={isAbsenz ? markerStyles.absenz : ''}
                >
                  <div>{`${key}:`}</div>
                  <div>{value}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div className={styles.dataContainer}>
        <Accordion
          expanded={beobDetailsOpen}
          onChange={onClickDetails}
          disableGutters
          elevation={1}
        >
          <AccordionSummary className={styles.dataSummary}>
            Daten
          </AccordionSummary>
          <AccordionDetails className={styles.dataDetails}>
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
                  <Field
                    key={key}
                    id={key}
                    label={key}
                    value={value}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </AccordionDetails>
        </Accordion>
      </div>
    </ErrorBoundary>
  )
}
