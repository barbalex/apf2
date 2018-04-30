// @flow
import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import RadioButtonGroup from './RadioButtonGroupGql'
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
  dataSource,
  saveToDb,
  popover,
}: {
  label: String,
  value?: ?Number | ?String,
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
    />
    <InfoWithPopover>{popover}</InfoWithPopover>
  </Container>
)

RadioButtonGroupWithInfo.defaultProps = {
  value: '',
}

export default observer(RadioButtonGroupWithInfo)
