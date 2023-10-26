import { useCallback, useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'

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
} from '@dnd-kit/sortable'

import { arrayMoveImmutable } from 'array-move'

import ErrorBoundary from '../../../../../shared/ErrorBoundary'
import SortableItem from './SortableItem'
import storeContext from '../../../../../../storeContext'

const BeobData = ({ fields }) => {
  const store = useContext(storeContext)
  const { sortedBeobFields: sortedBeobFieldsPassed, setSortedBeobFields } =
    store

  // use existing sorting if available and no own has been set yet
  const sortedBeobFields = sortedBeobFieldsPassed.slice()

  console.log('Beob, sortedBeobFields:', sortedBeobFields)

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

  console.log('Beob, render, fields:', fields)

  return (
    <ErrorBoundary>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field) => (
            <SortableItem key={field[0]} field={field} />
          ))}
          <DragOverlay>
            {draggingField ? (
              <SortableItem key={draggingField[0]} field={draggingField} />
            ) : null}
          </DragOverlay>
        </SortableContext>
      </DndContext>
    </ErrorBoundary>
  )
}

export default observer(BeobData)
