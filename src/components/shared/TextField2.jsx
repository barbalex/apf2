import { useState, useEffect } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { observer } from 'mobx-react-lite'

import styles from './TextField2.module.css'

export const TextField2 = observer(
  ({
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
  }) => {
    const value = row?.[name]
    const [stateValue, setStateValue] = useState(
      value || value === 0 ? value : '',
    )
    const onChange = (event) => setStateValue(event.target.value)

    useEffect(() => {
      setStateValue(value || value === 0 ? value : '')
    }, [value])

    const onKeyPress = (event) => event.key === 'Enter' && saveToDb(event)

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
          onBlur={saveToDb}
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
  },
)
