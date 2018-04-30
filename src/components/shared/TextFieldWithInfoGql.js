// @flow
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import styled from 'styled-components'

import InfoWithPopover from './InfoWithPopover'

const StyledTextField = styled(TextField)`
  padding-bottom: 19px !important;
  > div:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
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

type Props = {
  label: String,
  type?: String,
  multiLine?: Boolean,
  disabled?: Boolean,
  hintText?: String,
  popover: Object,
  saveToDb: () => void,
}

type State = {
  value: Number | String,
}

class TextFieldGql extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value || props.value === 0 ? props.value : '',
    }
  }

  static defaultProps = {
    value: '',
    type: 'text',
    multiLine: false,
    disabled: false,
    hintText: '',
    saveToDb: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const value =
      nextProps.value || nextProps.value === 0 ? nextProps.value : ''
    return { value }
  }

  handleChange = event => {
    this.setState({ value: event.target.value })
  }

  render() {
    const {
      label,
      type,
      multiLine,
      disabled,
      hintText,
      saveToDb,
      popover,
    } = this.props
    const { value } = this.state

    return (
      <StyledTextField
        id={label}
        label={label}
        value={value}
        type={type}
        multiline={multiLine}
        onChange={this.handleChange}
        onBlur={saveToDb}
        placeholder={hintText}
        disabled={disabled}
        fullWidth
        endAdornment={
          <InfoWithPopover>
            <PopoverContentRow>{popover}</PopoverContentRow>
          </InfoWithPopover>
        }
      />
    )
  }
}

export default TextFieldGql
