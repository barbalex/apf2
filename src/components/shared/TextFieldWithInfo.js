// @flow
import React, { Component } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'

import InfoWithPopover from './InfoWithPopover'

const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
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

class TextField extends Component<Props, State> {
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

  handleBlur = event => {
    const { saveToDb } = this.props
    saveToDb(event.target.value || null)
  }

  render() {
    const { label, type, multiLine, disabled, hintText, popover } = this.props
    const { value } = this.state

    return (
      <StyledFormControl fullWidth disabled={disabled}>
        <InputLabel htmlFor={label}>{label}</InputLabel>
        <Input
          id={label}
          value={value}
          type={type}
          multiline={multiLine}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          placeholder={hintText}
          endAdornment={
            <InfoWithPopover>
              <PopoverContentRow>{popover}</PopoverContentRow>
            </InfoWithPopover>
          }
        />
      </StyledFormControl>
    )
  }
}

export default TextField
