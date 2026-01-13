import { useState } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

import styles from './TextFieldNonUpdatable.module.css'

export const TextFieldNonUpdatable = ({ label, value = '' }) => {
  const [error, setError] = useState(null)
  const onChange = () => {
    setError('Dieser Wert ist nicht veränderbar')
    // can fire after component was unmounted...
    setTimeout(() => setError(null), 5000)
  }

  return (
    <FormControl
      error={!!error}
      fullWidth
      aria-describedby={`${label}-helper`}
      variant="standard"
      className={styles.formControl}
    >
      <InputLabel shrink>{label}</InputLabel>
      <Input
        id={label}
        value={value || value === 0 ? value : ''}
        onChange={onChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      {!!error && (
        <FormHelperText id={`${label}-helper`}>{error}</FormHelperText>
      )}
    </FormControl>
  )
}
