import styled from '@emotion/styled'

import { RadioButtonGroup } from './RadioButtonGroup.jsx'
import { InfoWithPopover } from './InfoWithPopover.jsx'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  break-inside: avoid;
`

export const RadioButtonGroupWithInfo = ({
  label,
  name,
  value = '',
  error,
  dataSource,
  saveToDb,
  popover,
}) => (
  <Container>
    <RadioButtonGroup
      value={value}
      name={name}
      dataSource={dataSource}
      saveToDb={saveToDb}
      label={label}
      error={error}
    />
    <InfoWithPopover name={name}>{popover}</InfoWithPopover>
  </Container>
)
