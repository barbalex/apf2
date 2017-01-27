import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

const StyledLabel = styled.div`
  margin-top: 10px;
  cursor: text;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.498039);
  pointer-events: none;
  user-select: none;
  padding-bottom: 8px;
`

const Label = ({ label }) =>
  <StyledLabel>
    {label}
  </StyledLabel>

Label.propTypes = {
  label: PropTypes.string.isRequired,
}

export default observer(Label)
