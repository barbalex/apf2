// @flow
import React from 'react'
import TextField from 'material-ui/TextField'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

const StyledTextField = styled(TextField)`
  > div:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  withState(
    'val',
    'setVal',
    ({ value }) => (value || value === 0 ? value : '')
  ),
  withHandlers({
    onChange: ({ setVal }) => event => setVal(event.target.value),
  })
)

const TextFieldGql = ({
  label,
  val,
  type,
  multiLine,
  disabled,
  hintText,
  onChange,
  onBlur,
}: {
  label: String,
  val?: ?Number | ?String,
  type?: String,
  multiLine?: Boolean,
  disabled?: Boolean,
  hintText?: String,
  onChange: () => void,
  onBlur: () => void,
}) => (
  <StyledTextField
    id={label}
    label={label}
    value={val}
    type={type}
    multiline={multiLine}
    onChange={onChange}
    onBlur={onBlur}
    placeholder={hintText}
    disabled={disabled}
    fullWidth
  />
)

TextFieldGql.defaultProps = {
  value: '',
  type: 'text',
  multiLine: false,
  disabled: false,
  hintText: '',
  onChange: null,
  onBlur: null,
}

export default enhance(TextFieldGql)
