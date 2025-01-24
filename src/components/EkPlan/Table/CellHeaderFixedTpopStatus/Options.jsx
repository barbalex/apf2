import { memo } from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import { useQuery } from '@apollo/client'

import { Option } from './Option.jsx'
import { query } from './query.js'

export const Options = memo(({refetch}) => {
  const { data } = useQuery(query)

  const options = data?.allPopStatusWertes?.nodes ?? []

  console.log('Options', options)

  return (
    <FormGroup>
      <FormLabel>Gewünschte Stati wählen:</FormLabel>
      {options.map((option) => (
        <Option
          key={option.id}
          option={option}
          refetch={refetch}
        />
      ))}
    </FormGroup>
  )
})
