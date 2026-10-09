import {
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import Input from '@mui/material/Input'

import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'

import styles from './KontrolljahrField.module.css'

interface KontrolljahrFieldProps {
  saveToDb: (event: {
    target: { name: string; value: number[] }
  }) => Promise<void>
  name?: string
  index: number
  kontrolljahre: number[]
  refetch: () => void
}

export const KontrolljahrField = ({
  saveToDb,
  name = 'kontrolljahre',
  index,
  kontrolljahre,
  refetch,
}: KontrolljahrFieldProps) => {
  const [value, setValue] = useState<number | string | null>(
    kontrolljahre[index] ?? null,
  )
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync local input state with server data after refetch
    setValue(kontrolljahre[index] ?? null)
  }, [index, kontrolljahre])

  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(ifIsNumericAsNumber(event.target.value))

  const onBlur = async () => {
    const newVal = [...kontrolljahre]
    if (value || value === 0) {
      // value comes from a numeric input and is a number at runtime
      newVal[index] = value as number
    } else {
      newVal.splice(index, 1)
    }
    await saveToDb({ target: { name, value: newVal } })
    refetch()
  }

  const onKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => e.key === 'Enter' && onBlur()

  return (
    <Input
      value={value}
      type="number"
      onChange={onChange}
      onBlur={() => void onBlur()}
      onKeyDown={(e) => void onKeyDown(e)}
      className={styles.styledInput}
    />
  )
}
