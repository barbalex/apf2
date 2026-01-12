import { useState } from 'react'
import Input from '@mui/material/Input'

import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'

import styles from './KontrolljahrFieldEmpty.module.css'

export const KontrolljahrFieldEmpty = ({
  saveToDb,
  name = 'kontrolljahre',
  kontrolljahre,
  refetch,
}) => {
  const [value, setValue] = useState('')

  const onChange = (event) => setValue(ifIsNumericAsNumber(event.target.value))

  const onBlur = async () => {
    if (value === '') return
    const newVal = [...kontrolljahre, value]
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
      autoFocus={true}
      className={styles.styledInput}
    />
  )
}
