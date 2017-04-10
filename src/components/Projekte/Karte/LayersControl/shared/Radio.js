import React from 'react'
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

const Radio = (
  {
    name,
    value,
    label,
    checked,
    onChange,
  }:
  {
    name: string,
    value: string,
    label: string,
    checked: boolean,
    onChange: () => void,
  }
) =>
  <Label>
    <Input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    {label}
  </Label>

export default observer(Radio)
