/**
 * not used any more
 * used to be used for berichte
 */
import React, { useCallback } from 'react'
import { MdOpenInNew } from 'react-icons/md'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { green } from '@mui/material/colors'
import styled from 'styled-components'
import getUrls from 'get-urls'
import { observer } from 'mobx-react-lite'

const Container = styled.div`
  display: flex;
  margin-bottom: -15px;
  break-inside: avoid;
`
const StyledOpenInNewIcon = styled(MdOpenInNew)`
  margin-top: 20px;
  cursor: pointer;
  font-size: 1.5rem;
  &:hover {
    color: ${green[300]};
  }
`
const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const TextFieldWithUrl = ({
  field,
  form,
  label,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
}) => {
  const { onChange, onBlur, value, name } = field
  const { error: errors, handleSubmit } = form
  const error = errors?.[name]

  const urls = value ? getUrls(value) : []

  const onKeyPress = useCallback(
    (event) => {
      event.key === 'Enter' && handleSubmit()
    },
    [handleSubmit],
  )

  return (
    <Container>
      <StyledFormControl
        disabled={disabled}
        fullWidth
        error={!!error}
        aria-describedby={`${label}ErrorText`}
        variant="standard"
      >
        <InputLabel htmlFor={label} shrink>
          {`${label} (gültige URL's beginnen mit "https://", "//" oder "www.")`}
        </InputLabel>
        <Input
          id={name}
          data-id={name}
          value={value || value === 0 ? value : ''}
          type={type}
          multiline={multiLine}
          onChange={onChange}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {!!error && (
          <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
        )}
      </StyledFormControl>
      {Array.from(urls).map((url, index) => (
        <div key={index} title={`${url} öffnen`}>
          <StyledOpenInNewIcon
            onClick={() =>
              typeof window !== 'undefined' && window.open(url, '_blank')
            }
            data-id="open-url"
          />
        </div>
      ))}
    </Container>
  )
}

export default observer(TextFieldWithUrl)
