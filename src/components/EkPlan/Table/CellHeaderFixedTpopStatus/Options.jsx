import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import { useQuery } from '@apollo/client/react'

import { Option } from './Option.jsx'
import { query } from './query.js'

import { formGroup } from './Options.module.css'

export const Options = ({ type }) => {
  const { data } = useQuery(query)
  const options = data?.allPopStatusWertes?.nodes ?? []

  return (
    <FormGroup className={formGroup}>
      {' '}
      ><FormLabel>Gewünschte Stati wählen:</FormLabel>
      {options.map((option) => (
        <Option
          key={option.id}
          option={option}
          type={type}
        />
      ))}
    </FormGroup>
  )
}
