import { useEffect, useState } from 'react'
import Input from '@mui/material/Input'
import styled from '@emotion/styled'

import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'

const StyledInput = styled(Input)`
  width: 45px;
  touch-action: none;
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

export const KontrolljahrField = ({
  saveToDb,
  name = 'kontrolljahre',
  index,
  kontrolljahre,
  refetch,
}) => {
  const [value, setValue] = useState(kontrolljahre[index])
  useEffect(() => {
    setValue(kontrolljahre[index])
  }, [index, kontrolljahre])

  const onChange = (event) => setValue(ifIsNumericAsNumber(event.target.value))

  const onBlur = async () => {
    const newVal = [...kontrolljahre]
    if (value || value === 0) {
      newVal[index] = value
    } else {
      newVal.splice(index, 1)
    }
    await saveToDb({ target: { name, value: newVal } })
    refetch()
  }

  const onKeyDown = (e) => e.key === 'Enter' && onBlur()

  return (
    <StyledInput
      value={value}
      type="number"
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  )
}
