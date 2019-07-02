import React, { useState } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

const Select = styled.select`
  width: 100%;
  height: 100% !important;
  background: transparent;
  border: none;
  border-collapse: collapse;
  font-size: 0.75rem;
`
const Optgroup = styled.optgroup`
  font-family: 'Roboto', 'Helvetica', 'Arial' !important;
  font-size: 1rem;
`
const Option = styled.option`
  font-family: 'Roboto', 'Helvetica', 'Arial' !important;
  font-size: 1rem;
`

const EkfreqzenzSelect = ({ ekfO, row, val }) => {
  const [ekfrequenzFocused, setEkfrequenzFocused] = useState(false)

  return (
    <Select
      value={val.value || ''}
      onChange={() => console.log('TODO')}
      onFocus={() => setEkfrequenzFocused(true)}
      onBlur={() => setEkfrequenzFocused(false)}
    >
      {ekfrequenzFocused ? (
        ekfO[row.apId] ? (
          Object.keys(ekfO[row.apId]).map(key => (
            <Optgroup key={key} label={key}>
              {ekfO[row.apId][key].map(o => (
                <Option key={o.value} value={o.value}>
                  {o.label}
                </Option>
              ))}
            </Optgroup>
          ))
        ) : null
      ) : (
        <Option key="ekfrequenzOption1" value={val.value || ''}>
          {val.value || ''}
        </Option>
      )}
    </Select>
  )
}

export default observer(EkfreqzenzSelect)
