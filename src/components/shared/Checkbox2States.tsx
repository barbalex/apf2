import type { InputHTMLAttributes } from 'react'
import Checkbox from '@mui/material/Checkbox'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

import type { SaveToDbHandler } from './types.ts'

import styles from './Checkbox2States.module.css'

export interface Checkbox2StatesProps {
  label?: string | undefined
  saveToDb: SaveToDbHandler
  value?: boolean | null | undefined
  name: string
  error?: string | null | undefined
  helperText?: string | undefined
  disabled?: boolean
}

export const Checkbox2States = ({
  label,
  saveToDb,
  value,
  name,
  error,
  helperText,
  disabled = false,
}: Checkbox2StatesProps) => {
  const onClickButton = () => {
    const fakeEvent = {
      target: {
        value: !value,
        name,
      },
    }
    // It is possible to directly click an option after editing an other field
    // this creates a race condition in the two submits which can lead to lost inputs!
    // so timeout inputs in option fields
    setTimeout(() => void saveToDb(fakeEvent))
  }

  const checked = value === true

  return (
    <FormControl
      component="fieldset"
      error={!!error}
      aria-describedby={`${label}ErrorText`}
      variant="standard"
      className={styles.formControl}
    >
      <FormLabel
        component="legend"
        className={styles.formLabel}
        htmlFor={name}
      >
        {label}
      </FormLabel>
      <Checkbox
        id={name}
        slotProps={{
          input: { 'data-id': name } as InputHTMLAttributes<HTMLInputElement>,
        }}
        onClick={onClickButton}
        color="primary"
        checked={checked}
        disabled={disabled}
        className={styles.checkbox}
      />
      {!!helperText && (
        <FormHelperText id={`${label}helperText`}>{helperText}</FormHelperText>
      )}
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </FormControl>
  )
}
