// @flow
import React from 'react'
import { observer } from 'mobx-react'
import Input, { InputLabel } from '@material-ui/core/Input'
import { FormControl, FormHelperText } from '@material-ui/core'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
const StyledInput = styled(Input)`
  &:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
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
  observer
)

const MyTextField = ({
  label,
  value,
  errorText,
  onChange,
}: {
  label: string,
  value?: ?number | ?string,
  errorText: string,
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

MyTextField.defaultProps = {
  value: '',
}

export default enhance(MyTextField)
