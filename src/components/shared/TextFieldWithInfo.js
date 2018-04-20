// @flow
import React from 'react'
import { observer } from 'mobx-react'
import Input, { InputLabel } from 'material-ui-next/Input'
import { FormControl, FormHelperText } from 'material-ui-next/Form'
import withHandlers from 'recompose/withHandlers'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import styled from 'styled-components'

import InfoWithPopover from './InfoWithPopover'

const PopoverContentRow = styled.div`
  padding: 2px 5px 2px 5px;
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-radius: 4px;
`
const StyledInput = styled(Input)`
  &:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  withState('valueHasBeenChanged', 'changeValueHasBeenChanged', false),
  withHandlers({
    onChange: props => event => {
      let { value } = event.target
      // ensure numbers saved as numbers
      if (event.target.type === 'number') {
        value = +value
      }
      props.updateProperty(props.tree, props.fieldName, value)
      props.changeValueHasBeenChanged(true)
    },
    onBlur: props => event => {
      let { value } = event.target
      // ensure numbers saved as numbers
      if (event.target.type === 'number') {
        value = +value
      }
      const { valueHasBeenChanged, tree, fieldName, updatePropertyInDb } = props
      if (valueHasBeenChanged) {
        updatePropertyInDb(tree, fieldName, value)
      }
    },
  }),
  observer
)

const MyTextField = ({
  label,
  value,
  errorText,
  type,
  multiLine,
  disabled,
  hintText,
  onChange,
  onBlur,
  popover,
}: {
  tree: Object,
  label: string,
  fieldName: string,
  value?: ?number | ?string,
  errorText?: ?string,
  type?: string,
  multiLine?: boolean,
  disabled?: boolean,
  hintText?: string,
  onChange: () => void,
  onBlur: () => void,
  // no idea why but this CAN get passed as undefined...
  updateProperty: () => void,
  updatePropertyInDb: () => void,
  popover: Object,
}) => (
  <FormControl
    error={!!errorText}
    disabled={disabled}
    fullWidth
    aria-describedby={`${label}-helper`}
  >
    <InputLabel htmlFor={label}>{label}</InputLabel>
    <StyledInput
      id={label}
      value={value || value === 0 ? value : ''}
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
    <FormHelperText id={`${label}-helper`}>{errorText}</FormHelperText>
  </FormControl>
)

MyTextField.defaultProps = {
  value: '',
  errorText: '',
  type: 'text',
  multiLine: false,
  disabled: false,
  hintText: '',
  updateProperty: null,
  updatePropertyInDb: null,
}

export default enhance(MyTextField)
