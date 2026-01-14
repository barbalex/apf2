import { useState } from 'react'
import Input from '@mui/material/Input'

import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'

import styles from './KontrolljahrFieldEmpty.module.css'

interface KontrolljahrFieldEmptyProps {
  saveToDb: (event: { target: { name: string; value: number[] } }) => Promise<void>
  name?: string
  kontrolljahre: number[]
  refetch: () => void
}

export const KontrolljahrFieldEmpty = ({
  saveToDb,
  name = 'kontrolljahre',
  kontrolljahre,
  refetch,
}: KontrolljahrFieldEmptyProps) => {
  const [value, setValue] = useState<string | number>('')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue(ifIsNumericAsNumber(event.target.value))

  const onBlur = async () => {
    if (value === '') return
    const newVal = [...kontrolljahre, value]
    await saveToDb({ target: { name, value: newVal } })
    refetch()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && onBlur()

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
