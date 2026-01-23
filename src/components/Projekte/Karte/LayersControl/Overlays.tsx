import { useState } from 'react'
import Button from '@mui/material/Button'
import { MdDragHandle, MdInfoOutline } from 'react-icons/md'
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
import { arrayMoveImmutable } from 'array-move'
import { useParams } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { layerLegends } from './layerLegends.ts'

import { Checkbox } from './shared/Checkbox.tsx'
import {
  mapOverlaysAtom,
  setMapOverlaysAtom,
  mapActiveOverlaysAtom,
  setMapActiveOverlaysAtom,
} from '../../../../store/index.ts'

import styles from './Overlays.module.css'

const SortableItem = ({
  id,
  overlay,
  activeOverlays,
  setActiveOverlays,
  apId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      className={styles.layer}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className={styles.label}>
        <div className={styles.check}>
          <Checkbox
            value={overlay.value}
            label={overlay.label}
            checked={activeOverlays.includes(overlay.value)}
            onChange={async () => {
              if (activeOverlays.includes(overlay.value)) {
                return setActiveOverlays(
                  activeOverlays.filter((o) => o !== overlay.value),
                )
              }
              return setActiveOverlays([...activeOverlays, overlay.value])
            }}
          />
        </div>
        <div className={styles.infoIcons}>
          {(layerLegends({ apId })[overlay.value] || [])
            .filter((layer) => !!layer.url)
            .map((layer) => (
              <div
                className={styles.icons}
                key={layer.name}
              >
                <div>
                  <Button
                    className={styles.iconButton}
                    color="inherit"
                    title={`Legende für ${layer.name} öffnen`}
                    onClick={() => window.open(layer.url, '_blank')}
                  >
                    <MdInfoOutline className={styles.legendIcon} />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className={styles.icons}>
        <div>
          <Button
            className={styles.iconButton}
            title="ziehen, um Layer höher/tiefer zu stapeln"
            color="inherit"
          >
            <MdDragHandle className={styles.dragHandleIcon} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Overlays = () => {
  const { apId } = useParams()

  const overlays = useAtomValue(mapOverlaysAtom)
  const setOverlays = useSetAtom(setMapOverlaysAtom)
  const activeOverlays = useAtomValue(mapActiveOverlaysAtom)
  const setActiveOverlays = useSetAtom(setMapActiveOverlaysAtom)

  const [draggingOverlay, setDraggingOverlay] = useState(null)
  const onDragStart = ({ active }) => setDraggingOverlay(active)

  const onDragEnd = ({ active, over }) => {
    setDraggingOverlay(null)
    if (active.id !== over.id) {
      const oldIndex = overlays.findIndex((e) => e.value === active.id)
      const newIndex = overlays.findIndex((e) => e.value === over.id)

      return setOverlays(arrayMoveImmutable(overlays, oldIndex, newIndex))
    }
  }

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

  // console.log('Overlays', overlays)

  return (
    <div className={styles.container}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
      >
        <SortableContext
          items={overlays.map((overlay) => overlay.value)}
          strategy={verticalListSortingStrategy}
        >
          {overlays.map((overlay) => (
            <SortableItem
              key={overlay.value}
              id={overlay.value}
              overlay={overlay}
              activeOverlays={activeOverlays}
              setActiveOverlays={setActiveOverlays}
              apId={apId}
            />
          ))}
          <DragOverlay>
            {draggingOverlay ?
              <SortableItem
                key={draggingOverlay.value}
                id={draggingOverlay.value}
                overlay={draggingOverlay}
                activeOverlays={activeOverlays}
                setActiveOverlays={setActiveOverlays}
                apId={apId}
              />
            : null}
          </DragOverlay>
        </SortableContext>
      </DndContext>
    </div>
  )
}
