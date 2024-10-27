import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import styled from '@emotion/styled'
import Linkify from 'react-linkify'

const Row = styled.div`
  display: flex;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  border-collapse: collapse;
  cursor: move;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`
const Label = styled.div`
  color: rgb(0, 0, 0, 0.54);
  width: 200px;
  min-width: 200px;
  padding: 5px;
  overflow-wrap: break-word;
`
const Value = styled.div`
  padding: 5px;
`

const ItemTypes = {
  CARD: 'card',
}

export const Field = ({ label, value, index, moveField }) => {
  const ref = useRef(null)
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveField(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id: label, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <Row ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      <Label>{label}</Label>
      <Value>
        <Linkify properties={{ target: '_blank' }}>{value}</Linkify>
      </Value>
    </Row>
  )
}
