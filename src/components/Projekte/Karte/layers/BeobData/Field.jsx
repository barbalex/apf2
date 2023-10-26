import styled from '@emotion/styled'

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

const Field = ({ label, value }) => {
  return (
    <Row>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Row>
  )
}

export default Field
