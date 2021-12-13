import React, { useCallback, useState } from 'react'
import Input from '@mui/material/Input'
import styled from 'styled-components'

import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const StyledInput = styled(Input)`
  width: 45px;
  touch-action: none;
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const KontrolljahrFieldEmpty = ({
  saveToDb,
  name = 'kontrolljahre',
  kontrolljahre,
  refetch,
}) => {
  const [value, setValue] = useState('')

  const onChange = useCallback(
    (event) => setValue(ifIsNumericAsNumber(event.target.value)),
    [],
  )

  const onBlur = useCallback(async () => {
    if (value === '') return
    const newVal = [...kontrolljahre, value]
    await saveToDb({ target: { name, value: newVal } })
    refetch()
  }, [value, kontrolljahre, saveToDb, name, refetch])

  const onKeyDown = useCallback((e) => e.key === 'Enter' && onBlur(), [onBlur])

  return (
    <StyledInput
      value={value}
      type="number"
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      autoFocus={true}
    />
  )
}

export default KontrolljahrFieldEmpty
