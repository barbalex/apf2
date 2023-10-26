import styled from '@emotion/styled'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const Row = styled.div`
  display: flex;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  border-collapse: collapse;
  font-size: 0.75rem;
  cursor: move;
  &:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.01);
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`
const Label = styled.div`
  color: rgb(0, 0, 0, 0.54);
  width: 110px;
  min-width: 110px;
  padding: 0 2px;
  overflow-wrap: break-word;
`
const Value = styled.div`
  padding: 0 2px;
`

const Field = ({ field }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field[0] })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <Row ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Label>{field[0]}</Label>
      <Value>{field[1]}</Value>
    </Row>
  )
}

export default Field
