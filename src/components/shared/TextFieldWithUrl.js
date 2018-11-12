// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import green from '@material-ui/core/colors/green'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withLifecycle from '@hocs/with-lifecycle'
import getUrls from 'get-urls'

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

const enhance = compose(
  withState('stateValue', 'setStateValue', ({ value: propsValue }) =>
    propsValue || propsValue === 0 ? propsValue : '',
  ),
  withHandlers({
    onChange: ({ setStateValue }) => event => setStateValue(event.target.value),
    onOpen: () => e => window.open(e.target.dataset.url, '_blank'),
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (props.value !== prevProps.value) {
        const value = props.value || props.value === 0 ? props.value : ''
        props.setStateValue(value)
      }
    },
  }),
)

const TextFieldWithUrl = ({
  value: propsValue,
  stateValue,
  label,
  name,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
  error,
  saveToDb,
  onChange,
  onOpen,
}: {
  value: Number | String,
  stateValue: Number | String,
  label: String,
  name: String,
  type: String,
  multiLine: Boolean,
  disabled: Boolean,
  hintText: String,
  error: String,
  saveToDb: () => void,
  onChange: () => void,
  onOpen: () => void,
}) => {
  const urls = stateValue ? getUrls(stateValue) : []

  return (
    <Container>
      <StyledFormControl
        disabled={disabled}
        fullWidth
        error={!!error}
        aria-describedby={`${label}ErrorText`}
      >
        <InputLabel htmlFor={label}>
          {`${label} (gültige URL's beginnen mit "https://", "//" oder "www.")`}
        </InputLabel>
        <Input
          id={label}
          name={name}
          value={stateValue}
          type={type}
          multiline={multiLine}
          onChange={onChange}
          onBlur={saveToDb}
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
          <StyledOpenInNewIcon onClick={onOpen} data-url={url} />
        </div>
      ))}
    </Container>
  )
}

export default enhance(TextFieldWithUrl)
