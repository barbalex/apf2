// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withLifecycle from '@hocs/with-lifecycle'

import InfoWithPopover from './InfoWithPopover'

const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const PopoverContentRow = styled.div`
  padding: 2px 5px 2px 5px;
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-radius: 4px;
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

const TextFieldWithInfo = ({
  value: propsValue,
  stateValue,
  label,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
  popover,
  saveToDb,
  onChange,
  onBlur,
  error,
}: {
  value: Number | String,
  stateValue: Number | String,
  label: String,
  type: String,
  multiLine: Boolean,
  disabled: Boolean,
  hintText: String,
  error: String,
  popover: Object,
  saveToDb: () => void,
  onChange: () => void,
  onBlur: () => void,
}) =>
  <StyledFormControl
    fullWidth
    disabled={disabled}
    error={!!error}
    aria-describedby={`${label}ErrorText`}
  >
    <InputLabel htmlFor={label}>{label}</InputLabel>
    <Input
      id={label}
      value={stateValue}
      type={type}
      multiline={multiLine}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={hintText}
      endAdornment={
        <InfoWithPopover>
          <PopoverContentRow>{popover}</PopoverContentRow>
        </InfoWithPopover>
      }
    />
    {
      !!error &&
      <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
    }
  </StyledFormControl>

export default enhance(TextFieldWithInfo)
