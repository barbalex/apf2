import { memo } from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'

import { Option } from './Option.jsx'
import { query } from './query.js'

const StyledFormGroup = styled(FormGroup)`
  padding-top: 8px;
`

export const Options = memo(({ type }) => {
  const { data } = useQuery(query)
  const options = data?.allPopStatusWertes?.nodes ?? []

  return (
    <StyledFormGroup>
      <FormLabel>Gewünschte Stati wählen:</FormLabel>
      {options.map((option) => (
        <Option
          key={option.id}
          option={option}
          type={type}
        />
      ))}
    </StyledFormGroup>
  )
})
