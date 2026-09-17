import { useState, type ChangeEvent, type KeyboardEvent } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

import styles from './TextField2.module.css'

export interface TextField2Props {
  row?: Record<string, unknown> | null | undefined
  label?: string | undefined
  name: string
  type?: string
  multiLine?: boolean
  disabled?: boolean
  hintText?: string | undefined
  helperText?: string | undefined
  errors?: Record<string, string | null | undefined> | undefined
  required?: boolean
  saveToDb: (event: {
    target: { name?: string; value: string | number | boolean | null }
  }) => void | Promise<void>
}

export const TextField2 = ({
  row,
  label,
  name,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
  helperText = '',
  errors,
  saveToDb,
  required = false,
}: TextField2Props) => {
  const value = (row?.[name] as string | number | null | undefined) ?? null
  const [stateValue, setStateValue] = useState<string | number>(
    value || value === 0 ? value : '',
  )
  const [prevValue, setPrevValue] = useState<string | number | null | undefined>(
    value,
  )
  // adjust state when the value changes from outside
  if (prevValue !== value) {
    setPrevValue(value)
    setStateValue(value || value === 0 ? value : '')
  }
  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    setStateValue(event.target.value)


  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement
      void saveToDb({ target: { name: target.name, value: target.value } })
    }
  }

  const error = errors ? errors?.[name] : null

  return (
    <FormControl
      fullWidth
      disabled={disabled}
      error={!!error}
      aria-describedby={`${label}ErrorText`}
      variant="standard"
      className={styles.formControl}
    >
      <InputLabel
        htmlFor={name}
        shrink
        required={required}
      >
        {label}
      </InputLabel>
      <Input
        id={name}
        name={name}
        value={stateValue}
        type={type}
        multiline={multiLine}
        onChange={onChange}
        onBlur={(event) => void saveToDb(event)}
        onKeyPress={onKeyPress}
        placeholder={hintText}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
      {!!helperText && (
        <FormHelperText id={`${label}HelperText`}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}
