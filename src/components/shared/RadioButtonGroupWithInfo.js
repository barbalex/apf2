// @flow
import React from 'react'
import styled from 'styled-components'

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
  value,
  error,
  dataSource,
  saveToDb,
  popover,
}: {
  label: String,
  value?: ?Number | ?String,
  error: String,
  dataSource: Array<Object>,
  saveToDb: () => void,
  popover: Object,
}) => (
  <Container>
    <RadioButtonGroup
      value={value}
      dataSource={dataSource}
      saveToDb={saveToDb}
      label={label}
      error={error}
    />
    <InfoWithPopover>{popover}</InfoWithPopover>
  </Container>
)

RadioButtonGroupWithInfo.defaultProps = {
  value: '',
}

export default RadioButtonGroupWithInfo
