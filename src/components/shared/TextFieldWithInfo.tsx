import {
  useState,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

import { InfoWithPopover } from './InfoWithPopover.tsx'
import styles from './TextFieldWithInfo.module.css'

export interface TextFieldWithInfoProps {
  value?: string | number | null | undefined
  label?: string | undefined
  name: string
  type?: string
  multiLine?: boolean
  disabled?: boolean
  hintText?: string | undefined
  popover?: ReactNode | undefined
  saveToDb: (event: {
    target: { name?: string; value: string | number | boolean | null }
  }) => void | Promise<void>
  error?: string | null | undefined
}

export const TextFieldWithInfo = ({
  value: propsValue,
  label,
  name,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
  popover,
  saveToDb,
  error,
}: TextFieldWithInfoProps) => {
  const [stateValue, setStateValue] = useState<string | number>(
    propsValue || propsValue === 0 ? propsValue : '',
  )
  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    setStateValue(event.target.value)

  useEffect(() => {
    setStateValue(propsValue || propsValue === 0 ? propsValue : '')
  }, [propsValue])

  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement
      void saveToDb({ target: { name: target.name, value: target.value } })
    }
  }

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
        endAdornment={
          <InfoWithPopover name={name}>
            <div className={styles.popoverContentRow}>{popover}</div>
          </InfoWithPopover>
        }
      />
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </FormControl>
  )
}
