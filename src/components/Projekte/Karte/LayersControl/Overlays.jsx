import { useContext, useCallback, useState } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import {
  MdDragHandle as DragHandleIcon,
  MdInfoOutline as InfoOutlineIcon,
} from 'react-icons/md'
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
import { useParams } from 'react-router-dom'
import { layerLegends } from './layerLegends.js'
import findIndex from 'lodash/findIndex'

import { Checkbox } from './shared/Checkbox.jsx'
import { StoreContext } from '../../../../storeContext.js'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 3px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`
const StyledIconButton = styled(Button)`
  max-width: 18px;
  min-height: 20px !important;
  min-width: 20px !important;
  padding: 0 !important;
  margin-top: -3px !important;
`
const StyledDragHandleIcon = styled(DragHandleIcon)`
  height: 20px !important;
  color: #7b7b7b !important;
  cursor: grab;
`
const StyledLegendIcon = styled(InfoOutlineIcon)`
  height: 20px !important;
  color: #7b7b7b !important;
  cursor: pointer;
`
const LayerDiv = styled.div`
  display: grid;
  grid-template-columns: 360px 20px;
  padding-top: 4px;
  &:not(:last-of-type) {
    border-bottom: 1px solid #ececec;
  }
  /*
   * z-index is needed because leaflet
   * sets high one for controls
   */
  z-index: 2000;
  /*
   * font-size is lost while moving a layer
   * because it is inherited from higher up
   */
  font-size: 12px;
`
const LabelDiv = styled.div`
  display: flex;
`
const CheckDiv = styled.div`
  flex-grow: 1;
`
const InfoIconsDivs = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
`
const IconsDiv = styled.div`
  display: flex;
`
// TODO: add icon: https://material.io/icons/#ic_info
// for layers with legend

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
    <LayerDiv
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <LabelDiv>
        <CheckDiv>
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
        </CheckDiv>
        <InfoIconsDivs>
          {(layerLegends({ apId })[overlay.value] || [])
            .filter((layer) => !!layer.url)
            .map((layer) => (
              <IconsDiv key={layer.name}>
                <div>
                  <StyledIconButton
                    color="inherit"
                    title={`Legende für ${layer.name} öffnen`}
                    onClick={() => window.open(layer.url, '_blank')}
                  >
                    <StyledLegendIcon />
                  </StyledIconButton>
                </div>
              </IconsDiv>
            ))}
        </InfoIconsDivs>
      </LabelDiv>
      <IconsDiv>
        <IconsDiv>
          <div>
            <StyledIconButton
              title="ziehen, um Layer höher/tiefer zu stapeln"
              color="inherit"
            >
              <StyledDragHandleIcon />
            </StyledIconButton>
          </div>
        </IconsDiv>
      </IconsDiv>
    </LayerDiv>
  )
}
export const Overlays = observer(() => {
  const { apId } = useParams()

  const store = useContext(StoreContext)
  const {
    overlays: overlaysIn,
    activeOverlays: activeOverlaysIn,
    setOverlays,
    setActiveOverlays,
  } = store
  const overlays = getSnapshot(overlaysIn)
  const activeOverlays = getSnapshot(activeOverlaysIn)

  const [draggingOverlay, setDraggingOverlay] = useState(null)
  const onDragStart = useCallback(
    ({ active }) => setDraggingOverlay(active),
    [],
  )
  const onDragEnd = useCallback(
    ({ active, over }) => {
      setDraggingOverlay(null)
      if (active.id !== over.id) {
        const oldIndex = findIndex(overlays, ['value', active.id])
        const newIndex = findIndex(overlays, ['value', over.id])

        return setOverlays(arrayMoveImmutable(overlays, oldIndex, newIndex))
      }
    },
    [overlays, setOverlays],
  )

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
    <CardContent>
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
    </CardContent>
  )
})
