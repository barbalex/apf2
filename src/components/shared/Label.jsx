import React from 'react'
import styled from '@emotion/styled'

const StyledLabel = styled.div`
  margin-top: 10px;
  cursor: text;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  user-select: none;
  padding-bottom: 8px;
`

const Label = ({ label }) => <StyledLabel>{label}</StyledLabel>

export default Label
