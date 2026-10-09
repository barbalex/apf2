import Radio from '@mui/material/Radio'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

import type { SaveToDbHandler } from './types.ts'

import styles from './RadioButton.module.css'

export interface RadioButtonProps {
  label?: string | undefined
  name: string
  value?: boolean | null | undefined
  error?: string | null | undefined
  saveToDb: SaveToDbHandler
}

export const RadioButton = ({
  label,
  name,
  value,
  error,
  saveToDb,
}: RadioButtonProps) => {
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
      >
        {label}
      </FormLabel>
      <Radio
        data-id={name}
        onClick={onClickButton}
        color="primary"
        checked={value === true}
        className={styles.radio}
      />
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </FormControl>
  )
}
