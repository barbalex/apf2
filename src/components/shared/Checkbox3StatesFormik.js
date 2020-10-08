import React, { useCallback } from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useField } from 'formik'

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
const Aside = styled.div`
  position: relative;
  bottom: 20px;
  left: 28px;
`
const AsideComment = styled.span`
  padding-left: 6px;
  font-size: 0.8em;
  color: rgba(0, 0, 0, 0.54);
`

const Checkbox3StatesFormik = ({ label, handleSubmit, ...props }) => {
  const [field, meta] = useField(props)
  const { onChange, onBlur, value, name } = field
  const { error: errors } = meta
  const error = errors?.[name]

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
  const asideText =
    value === true ? `Ja` : value === false ? `Nein` : `Unbestimmt`
  const asideComment =
    value === true
      ? `(nach nächstem Klick 'Nein')`
      : value === false
      ? `(nach nächstem Klick 'Unbestimmt')`
      : `(nach nächstem Klick 'Ja')`

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
        />
        <Aside>
          {asideText}
          <AsideComment>{asideComment}</AsideComment>
        </Aside>
        {!!error && (
          <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
        )}
      </StyledFormControl>
    </div>
  )
}

export default observer(Checkbox3StatesFormik)
