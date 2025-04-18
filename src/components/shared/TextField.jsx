import { useState, useCallback, useEffect, memo } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

export const TextField = memo(
  observer(
    ({
      value,
      label,
      name,
      type = 'text',
      multiLine = false,
      disabled = false,
      hintText = '',
      helperText = '',
      error,
      saveToDb,
      required = false,
      onFocus = () => {
        // do nothing
      },
    }) => {
      const [stateValue, setStateValue] = useState(
        value || value === 0 ? value : '',
      )
      const onChange = useCallback(
        (event) => setStateValue(event.target.value),
        [],
      )
      useEffect(() => {
        setStateValue(value || value === 0 ? value : '')
      }, [value])

      const onKeyPress = useCallback(
        (event) => {
          if (event.key === 'Enter') {
            saveToDb(event)
          }
        },
        [saveToDb],
      )

      return (
        <StyledFormControl
          fullWidth
          disabled={disabled}
          error={!!error}
          aria-describedby={`${label}ErrorText`}
          variant="standard"
        >
          <InputLabel
            htmlFor={label}
            shrink
            required={required}
          >
            {label}
          </InputLabel>
          <Input
            id={name}
            // ref={textFieldRef}
            name={name}
            value={stateValue}
            type={type}
            multiline={multiLine}
            onChange={onChange}
            onBlur={saveToDb}
            onFocus={onFocus}
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
        </StyledFormControl>
      )
    },
  ),
)
