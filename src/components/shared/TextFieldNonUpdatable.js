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

const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  withState('error', 'setError', null),
  withHandlers({
    onChange: ({ setError }) => () => {
      setError('Dieser Wert ist nicht veränderbar')
      setTimeout(() => setError(null), 5000)
    },
  }),
)

const MyTextField = ({
  label,
  value = '',
  error,
  onChange,
}: {
  label: String,
  value?: ?Number | ?String,
  error: String,
  onChange: () => void,
}) => (
  <StyledFormControl
    error={!!error}
    fullWidth
    aria-describedby={`${label}-helper`}
  >
    <InputLabel htmlFor={label}>{label}</InputLabel>
    <Input
      id={label}
      value={value || value === 0 ? value : ''}
      onChange={onChange}
    />
    {
      !!error &&
      <FormHelperText id={`${label}-helper`}>{error}</FormHelperText>
    }
  </StyledFormControl>
)

export default enhance(MyTextField)
