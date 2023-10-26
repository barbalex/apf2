import { useCallback, useMemo, useContext, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { useQuery } from '@tanstack/react-query'
import { arrayMoveImmutable } from 'array-move'

import exists from '../../../../../modules/exists'
import ErrorBoundary from '../../../../shared/ErrorBoundary'
import Error from '../../../../shared/Error'
import Spinner from '../../../../shared/Spinner'
import Beob from './Field'
import storeContext from '../../../../../storeContext'
import { beob } from '../../../../shared/fragments'
import { Info } from '../BeobZugeordnet/Marker'

const TopFieldContainer = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
`
const Container = styled.div`
  margin-left: -10px;
  margin-right: -10px;
`
const StyledAccordion = styled(Accordion)``
const StyledAccordionSummary = styled(AccordionSummary)`
  margin: 0;
  padding: 0 10px;
  min-height: 28px;
  > div {
    margin: 0;
  }
`
const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 4px 8px;
`

const topFieldNames = [
  'PRESENCE',
  'presence',
  'XY_PRECISION',
  'xy_radius',
  'locality_descript',
]

const SortableItem = ({ id, field }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      key={field[0]}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Beob key={field[0]} label={field[0]} value={field[1]} />
    </div>
  )
}

const BeobData = ({ id }) => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const { sortedBeobFields: sortedBeobFieldsPassed, setSortedBeobFields } =
    store

  const { setBeobDetailsOpen, beobDetailsOpen } = store.map
  const onClickDetails = useCallback(
    () => setBeobDetailsOpen(!beobDetailsOpen),
    [beobDetailsOpen, setBeobDetailsOpen],
  )

  // use existing sorting if available and no own has been set yet
  const sortedBeobFields = sortedBeobFieldsPassed.slice()

  console.log('Beob, sortedBeobFields:', sortedBeobFields)

  const sortFn = useCallback(
    (a, b) => {
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
    },
    [sortedBeobFields],
  )

  const [draggingField, setDraggingField] = useState(null)
  const onDragStart = useCallback(({ active }) => setDraggingField(active), [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const { data, isLoading, error } = useQuery({
    queryKey: ['beobByIdQueryForBeob', id],
    queryFn: async () =>
      client.query({
        query: gql`
          query beobByIdQueryForBeobLayer($id: UUID!) {
            beobById(id: $id) {
              ...BeobFields
            }
          }
          ${beob}
        `,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const row = data?.data?.beobById ?? {}
  const rowData = useMemo(
    () => (row.data ? JSON.parse(row.data) : {}),
    [row.data],
  )

  const topFields = useMemo(
    () =>
      Object.entries(rowData)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        .filter(([key, value]) => exists(value))
        .filter(([key]) => topFieldNames.includes(key))
        .sort(sortFn),
    [rowData, sortFn],
  )

  const fields = useMemo(
    () =>
      Object.entries(rowData)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        .filter(([key, value]) => exists(value))
        .sort(sortFn),
    [rowData, sortFn],
  )
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

  const onDragEnd = useCallback(
    ({ active, over }) => {
      // TODO: over is WRONG!!!!
      setDraggingField(null)
      console.log('Beob, onDragEnd:', {
        active,
        over,
        fields,
        sortedBeobFields,
      })
      if (active.id === over.id) return

      const oldIndex = sortedBeobFields.indexOf(active.id)
      const newIndex = sortedBeobFields.indexOf(over.id)
      console.log('Beob, onDragEnd:', { oldIndex, newIndex })
      // catch some edge cases
      if (oldIndex === newIndex) return
      if (oldIndex === -1) return
      if (newIndex === -1) return
      // move
      const newArray = arrayMoveImmutable(sortedBeobFields, oldIndex, newIndex)
      console.log('Beob, onDragEnd:', {
        newArray,
        sortedBeobFields,
        oldIndex,
        newIndex,
      })
      setSortedBeobFields(newArray)
    },
    [fields, setSortedBeobFields, sortedBeobFields],
  )

  if (!row) return null
  if (!fields || fields.length === 0) return null
  if (isLoading) return <Spinner />
  if (error) return <Error error={error} />

  console.log('Beob, render, fields:', fields)

  return (
    <ErrorBoundary>
      {!!topFields.length && (
        <TopFieldContainer>
          <Info>
            {topFields.map(([key, value]) => (
              <>
                <div>{`${key}:`}</div>
                <div>{value}</div>
              </>
            ))}
          </Info>
        </TopFieldContainer>
      )}
      <Container>
        <StyledAccordion
          expanded={beobDetailsOpen}
          onChange={onClickDetails}
          disableGutters
          elevation={1}
        >
          <StyledAccordionSummary>Daten</StyledAccordionSummary>
          <StyledAccordionDetails>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
              onDragStart={onDragStart}
            >
              <SortableContext
                items={fields}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field, index) => (
                  <SortableItem
                    key={`${field[0]}/${index}`}
                    id={field[0]}
                    field={field}
                  />
                ))}
                <DragOverlay>
                  {draggingField ? (
                    <SortableItem
                      key={draggingField[0]}
                      id={draggingField[0]}
                      field={draggingField}
                    />
                  ) : null}
                </DragOverlay>
              </SortableContext>
            </DndContext>
          </StyledAccordionDetails>
        </StyledAccordion>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(BeobData)
