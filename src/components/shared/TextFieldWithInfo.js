// @flow
import React from 'react'
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField'
import withHandlers from 'recompose/withHandlers'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import styled from 'styled-components'

import InfoWithPopover from './InfoWithPopover'

const FieldWithInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: -10px;
  break-inside: avoid;
`
const InfoWithPopoverContainer = styled.div`
  padding-bottom: 5px;
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
  withState('valueHasBeenChanged', 'changeValueHasBeenChanged', false),
  withHandlers({
    onChange: props => (event, val) => {
      // ensure numbers saved as numbers
      if (event.target.type === 'number') {
        val = +val
      }
      props.updateProperty(props.tree, props.fieldName, val)
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
  <FieldWithInfoContainer>
    <TextField
      floatingLabelText={label}
      hintText={hintText}
      type={type}
      multiLine={multiLine}
      value={value || value === 0 ? value : ''}
      errorText={errorText}
      disabled={disabled}
      fullWidth
      onChange={onChange}
      onBlur={onBlur}
    />
    <InfoWithPopoverContainer>
      <InfoWithPopover>
        <PopoverContentRow>{popover}</PopoverContentRow>
      </InfoWithPopover>
    </InfoWithPopoverContainer>
  </FieldWithInfoContainer>
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
