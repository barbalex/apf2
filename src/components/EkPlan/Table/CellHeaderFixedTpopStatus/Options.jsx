import { memo } from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'

import { Option } from './Option.jsx'

export const Options = memo(() => {
  // TODO: query options
  const options = []

  return (
    <FormGroup>
      <FormLabel>Gewünschte Stati wählen:</FormLabel>
      {options.map((option) => (
        <Option
          key={option.value}
          option={option}
        />
      ))}
    </FormGroup>
  )
})
