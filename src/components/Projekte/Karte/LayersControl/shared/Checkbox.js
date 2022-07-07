import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin-left: 18px;
`
const Input = styled.input`
  margin-right: 4px;
  vertical-align: -2px;
`
const Label = styled.label`
  margin-left: -18px;
  padding-right: 4px;
  user-select: none;
`

const Checkbox = ({ value, label, checked, onChange }) => (
  <Container>
    <Label>
      <Input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
    </Label>
  </Container>
)

export default Checkbox
