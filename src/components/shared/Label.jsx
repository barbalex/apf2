import styled from '@emotion/styled'

const StyledLabel = styled.div`
  margin-top: 10px;
  cursor: text;
  font-size: 12px;
  color: ${(props) => props.color};
  pointer-events: none;
  user-select: none;
  padding-bottom: 4px;
`

export const Label = ({ label, color = 'rgba(0, 0, 0, 0.5)' }) => (
  <StyledLabel color={color}>{label}</StyledLabel>
)
