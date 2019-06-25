import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import RadioButtonGroup from './RadioButtonGroupFormik'
import InfoWithPopover from './InfoWithPopover'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  break-inside: avoid;
`

const RadioButtonGroupWithInfo = ({ popover, ...rest }) => {
  return (
    <Container>
      <RadioButtonGroup {...rest} />
      <InfoWithPopover>{popover}</InfoWithPopover>
    </Container>
  )
}

export default observer(RadioButtonGroupWithInfo)
