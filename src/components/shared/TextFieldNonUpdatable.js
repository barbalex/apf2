// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
const StyledInput = styled(Input)`
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  withState('errorText', 'updateErrorText', ''),
  withHandlers({
    onChange: props => () => {
      props.updateErrorText('Dieser Wert ist nicht veränderbar')
      setTimeout(() => props.updateErrorText(''), 5000)
    },
  }),
)

const MyTextField = ({
  label,
  value = '',
  errorText,
  onChange,
}: {
  label: String,
  value?: ?Number | ?String,
  errorText: String,
  onChange: () => void,
}) => (
  <FormControl
    error={!!errorText}
    fullWidth
    aria-describedby={`${label}-helper`}
  >
    <InputLabel htmlFor={label}>{label}</InputLabel>
    <StyledInput
      id={label}
      value={value || value === 0 ? value : ''}
      onChange={onChange}
    />
    <FormHelperText id={`${label}-helper`}>{errorText}</FormHelperText>
  </FormControl>
)

export default enhance(MyTextField)
