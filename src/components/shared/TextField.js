// @flow
import React from 'react'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withLifecycle from '@hocs/with-lifecycle'

const StyledTextField = styled(TextField)`
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
        props.setStateValue(props.value)
      }
    },
  }),
)

const MyTextField = ({
  value: propsValue,
  stateValue,
  label,
  type,
  multiLine,
  disabled,
  hintText,
  saveToDb,
  onChange,
  onBlur,
}: {
  value: Number | String,
  stateValue: Number | String,
  label: String,
  type: 'text',
  multiLine: false,
  disabled: false,
  hintText: '',
  saveToDb: null,
  onChange: () => void,
  onBlur: () => void,
}) => 
  <StyledTextField
    id={label}
    label={label}
    value={stateValue}
    type={type}
    multiline={multiLine}
    onChange={onChange}
    onBlur={onBlur}
    placeholder={hintText}
    disabled={disabled}
    fullWidth
  />

export default enhance(MyTextField)
