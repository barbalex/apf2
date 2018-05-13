// @flow
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import styled from 'styled-components'

const StyledTextField = styled(TextField)`
  padding-bottom: 19px !important;
  > div:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`

type Props = {
  label: String,
  type?: String,
  multiLine?: Boolean,
  disabled?: Boolean,
  hintText?: String,
  saveToDb: () => void,
}

type State = {
  value: Number | String,
}

class MyTextField extends Component<Props, State> {
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
    const { label, type, multiLine, disabled, hintText } = this.props
    const { value } = this.state

    return (
      <StyledTextField
        id={label}
        label={label}
        value={value}
        type={type}
        multiline={multiLine}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        placeholder={hintText}
        disabled={disabled}
        fullWidth
      />
    )
  }
}

export default MyTextField
