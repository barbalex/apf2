import React, { useState, useCallback, useEffect } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import green from '@material-ui/core/colors/green'
import styled from 'styled-components'
import getUrls from 'get-urls'
import { observer } from 'mobx-react-lite'

const Container = styled.div`
  display: flex;
  margin-bottom: -15px;
  break-inside: avoid;
`
const StyledOpenInNewIcon = styled(OpenInNewIcon)`
  margin-top: 20px;
  cursor: pointer;
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
  value: propsValue,
  label,
  name,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
  error,
  saveToDb,
}) => {
  const [stateValue, setStateValue] = useState(
    propsValue || propsValue === 0 ? propsValue : '',
  )

  const onChange = useCallback(event => setStateValue(event.target.value))
  const onOpen = useCallback(
    e =>
      typeof window !== 'undefined' &&
      window.open(e.target.dataset.url, '_blank'),
  )

  useEffect(() => {
    setStateValue(propsValue || propsValue === 0 ? propsValue : '')
  }, [propsValue])

  const urls = stateValue ? getUrls(stateValue) : []

  const onKeyPress = useCallback(event => {
    if (event.key === 'Enter') {
      saveToDb(event)
    }
  })

  return (
    <Container>
      <StyledFormControl
        disabled={disabled}
        fullWidth
        error={!!error}
        aria-describedby={`${label}ErrorText`}
      >
        <InputLabel htmlFor={label} shrink>
          {`${label} (gültige URL's beginnen mit "https://", "//" oder "www.")`}
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
            onClick={onOpen}
            data-url={url}
            data-id="open-url"
          />
        </div>
      ))}
    </Container>
  )
}

export default observer(TextFieldWithUrl)
