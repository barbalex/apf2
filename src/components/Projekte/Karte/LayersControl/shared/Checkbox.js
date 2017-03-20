import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

const Input = styled.input`
  margin-right: 4px;
  vertical-align: -2px;
`
const Label = styled.label`
  padding-right: 4px;
  user-select: none;
`

const Checkbox = ({ value, label, checked, onChange }) =>
  <Label>
    <Input
      type="checkbox"
      value={value}
      checked={checked}
      onChange={onChange}
    />
    {label}
  </Label>

Checkbox.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default observer(Checkbox)
