import React, { useCallback, useEffect, useState } from 'react'
import Input from '@mui/material/Input'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const StyledInput = styled(Input)`
  width: 45px;
  touch-action: none;
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const KontrolljahrField = ({
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

  const onChange = useCallback((event) => {
    setValue(ifIsNumericAsNumber(event.target.value))
  }, [])

  const onBlur = useCallback(async () => {
    const newVal = [...kontrolljahre]
    if (value || value === 0) {
      newVal[index] = value
    } else {
      newVal.splice(index, 1)
    }
    await saveToDb({ target: { name, value: newVal } })
    refetch()
  }, [kontrolljahre, value, saveToDb, name, refetch, index])

  const onKeyDown = useCallback((e) => e.key === 'Enter' && onBlur(), [onBlur])

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

export default observer(KontrolljahrField)
