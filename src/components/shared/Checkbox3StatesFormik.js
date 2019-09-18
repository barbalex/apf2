import React, { useCallback } from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

// without slight padding radio is slightly cut off!
const StyledFormControl = styled(FormControl)`
  padding-left: 1px !important;
  padding-bottom: 15px !important;
`
const StyledFormLabel = styled(FormLabel)`
  padding-top: 10px !important;
  padding-bottom: 8px !important;
  font-size: 12px !important;
  cursor: text;
  user-select: none;
  pointer-events: none;
`
const StyledCheckbox = styled(Checkbox)`
  height: 2px !important;
  width: 24px;
`

const RadioButton = ({ field, form, label }) => {
  const { onChange, onBlur, value, name } = field
  const { errors, handleSubmit } = form
  const error = errors[name]

  const onClickButton = useCallback(() => {
    let newValue = null
    if (value === true) newValue = false
    if (value === false) newValue = null
    if (value === null) newValue = true
    const fakeEvent = {
      target: {
        value: newValue,
        name,
      },
    }
    onChange(fakeEvent)
    onBlur(fakeEvent)
    setTimeout(() => handleSubmit())
  }, [value, name, onChange, onBlur, handleSubmit])

  const indeterminate = value === null
  const checked = value === true
  const title =
    value === true
      ? `Ja. Nach nächstem Klick 'Nein'`
      : value === false
      ? `Nein. Nach nächstem Klick 'Unbestimmt'`
      : `Unbestimmt. Nach nächstem Klick 'Ja'`

  return (
    <div>
      <StyledFormControl
        component="fieldset"
        error={!!error}
        aria-describedby={`${label}ErrorText`}
      >
        <StyledFormLabel component="legend">{label}</StyledFormLabel>
        <StyledCheckbox
          data-id={name}
          onClick={onClickButton}
          color="primary"
          checked={checked}
          indeterminate={indeterminate}
          title={title}
        />
        {!!error && (
          <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
        )}
      </StyledFormControl>
    </div>
  )
}

RadioButton.defaultProps = {
  value: 'false',
}

export default observer(RadioButton)
