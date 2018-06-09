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
/**
 * DO NOT UPDATE get-urls
 * before create-react-app moves to using babili
 * see: https://github.com/facebookincubator/create-react-app/issues/984#issuecomment-257105773
 * and: https://github.com/sindresorhus/get-urls/issues/17
 */
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
  withState(
    'stateValue',
    'setStateValue',
    ({ value: propsValue }) =>
      (propsValue || propsValue === 0) ? propsValue : ''
  ),
  withHandlers({
    onChange: ({ setStateValue }) => event =>
      setStateValue(event.target.value),
    onBlur: ({ saveToDb }) => event =>
      saveToDb(event.target.value || null),
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (props.value !== prevProps.value) {
        const value = (props.value || props.value === 0) ? props.value : ''
        props.setStateValue(value)
      }
    },
  }),
)

const TextFieldWithUrl = ({
  value: propsValue,
  stateValue,
  label,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
  error,
  saveToDb,
  onChange,
  onBlur,
}: {
  value: Number | String,
  stateValue: Number | String,
  label: String,
  type: String,
  multiLine: Boolean,
  disabled: Boolean,
  hintText: String,
  error: String,
  saveToDb: () => void,
  onChange: () => void,
  onBlur: () => void,
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
          {`${label} (bitte "www." statt "https://" eingeben)`}
        </InputLabel>
        <Input
          id={label}
          value={stateValue}
          type={type}
          multiline={multiLine}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {
          !!error &&
          <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
        }
      </StyledFormControl>
      {Array.from(urls).map((url, index) => (
        <div key={index} title={`${url} öffnen`}>
          <StyledOpenInNewIcon onClick={() => window.open(url, '_blank')} />
        </div>
      ))}
    </Container>
  )
}

export default enhance(TextFieldWithUrl)
