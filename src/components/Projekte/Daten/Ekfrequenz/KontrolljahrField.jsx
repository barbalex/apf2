import { useEffect, useState } from 'react'
import Input from '@mui/material/Input'

import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'

import { styledInput } from './KontrolljahrField.module.css'

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
    <Input
      value={value}
      type="number"
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={styledInput}
    />
  )
}
