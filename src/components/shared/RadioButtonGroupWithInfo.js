import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import RadioButtonGroup from './RadioButtonGroup'
import InfoWithPopover from './InfoWithPopover'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  break-inside: avoid;
`

const RadioButtonGroupWithInfo = ({
  label,
  name,
  value,
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

RadioButtonGroupWithInfo.defaultProps = {
  value: '',
}

export default observer(RadioButtonGroupWithInfo)
