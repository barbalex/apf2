import { useContext, useState } from 'react'
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
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { useParams } from 'react-router'
import { layerLegends } from './layerLegends.js'

import { Checkbox } from './shared/Checkbox.jsx'
import { MobxContext } from '../../../../mobxContext.js'

import {
  container,
  iconButton,
  dragHandleIcon,
  legendIcon,
  layer as layerClass,
  label,
  check,
  infoIcons,
  icons,
} from './Overlays.module.css'

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
      className={layerClass}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className={label}>
        <div className={check}>
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
        <div className={infoIcons}>
          {(layerLegends({ apId })[overlay.value] || [])
            .filter((layer) => !!layer.url)
            .map((layer) => (
              <div
                className={icons}
                key={layer.name}
              >
                <div>
                  <Button
                    className={iconButton}
                    color="inherit"
                    title={`Legende für ${layer.name} öffnen`}
                    onClick={() => window.open(layer.url, '_blank')}
                  >
                    <MdInfoOutline className={legendIcon} />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className={icons}>
        <div>
          <Button
            className={iconButton}
            title="ziehen, um Layer höher/tiefer zu stapeln"
            color="inherit"
          >
            <MdDragHandle className={dragHandleIcon} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Overlays = observer(() => {
  const { apId } = useParams()

  const store = useContext(MobxContext)
  const {
    overlays: overlaysIn,
    activeOverlays: activeOverlaysIn,
    setOverlays,
    setActiveOverlays,
  } = store
  const overlays = getSnapshot(overlaysIn)
  const activeOverlays = getSnapshot(activeOverlaysIn)

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
    <div className={container}>
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
})
