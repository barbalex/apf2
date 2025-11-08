import { useState, useEffect } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { observer } from 'mobx-react-lite'

import { InfoWithPopover } from './InfoWithPopover.jsx'
import { formControl, popoverContentRow } from './TextFieldWithInfo.module.css'

export const TextFieldWithInfo = observer(
  ({
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
  }) => {
    const [stateValue, setStateValue] = useState(
      propsValue || propsValue === 0 ? propsValue : '',
    )
    const onChange = (event) => setStateValue(event.target.value)

    useEffect(() => {
      setStateValue(propsValue || propsValue === 0 ? propsValue : '')
    }, [propsValue])

    const onKeyPress = (event) => event.key === 'Enter' && saveToDb(event)

    return (
      <FormControl
        fullWidth
        disabled={disabled}
        error={!!error}
        aria-describedby={`${label}ErrorText`}
        variant="standard"
        className={formControl}
      >
        <InputLabel
          htmlFor={label}
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
          onBlur={saveToDb}
          onKeyPress={onKeyPress}
          placeholder={hintText}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          endAdornment={
            <InfoWithPopover name={name}>
              <div className={popoverContentRow}>{popover}</div>
            </InfoWithPopover>
          }
        />
        {!!error && (
          <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
        )}
      </FormControl>
    )
  },
)
