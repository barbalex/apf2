// @flow
import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import { darkBlack } from 'material-ui/styles/colors'

const StyledLabel = styled.div`
  margin-top: 10px;
  cursor: text;
  font-size: 12px;
  color: fade(${darkBlack}, 0.4);
  pointer-events: none;
  user-select: none;
  padding-bottom: 8px;
`

const Label = ({ label }: { label: string }) => (
  <StyledLabel>
    {label}
  </StyledLabel>
)

export default observer(Label)
