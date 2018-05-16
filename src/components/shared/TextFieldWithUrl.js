// @flow
import React, { Component } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import green from '@material-ui/core/colors/green'
/**
 * DO NOT UPDATE get-urls
 * before create-react-app moves to using babili
 * see: https://github.com/facebookincubator/create-react-app/issues/984#issuecomment-257105773
 * and: https://github.com/sindresorhus/get-urls/issues/17
 */
import getUrls from 'get-urls'

const Container = styled.div`
  display: flex;
  margin-bottom: -15px;
  break-inside: avoid;
`
const StyledOpenInNewIcon = styled(OpenInNewIcon)`
  margin-top: 20px;
  cursor: pointer;
  &:hover {
    color: ${green[300]};
  }
`
const StyledInput = styled(Input)`
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

type Props = {
  label: String,
  type?: String,
  multiLine?: Boolean,
  disabled?: Boolean,
  saveToDb: () => void,
}

type State = {
  value: Number | String,
}

class TextFieldWithUrl extends Component<Props, State> {
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
    const { label, type, multiLine, disabled } = this.props
    const { value } = this.state
    const urls = value ? getUrls(value) : []

    return (
      <Container>
        <FormControl disabled={disabled} fullWidth>
          <InputLabel htmlFor={label}>
            {`${label} (bitte "www." statt "https://" eingeben)`}
          </InputLabel>
          <StyledInput
            id={label}
            value={value || ''}
            type={type}
            multiline={multiLine}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </FormControl>
        {Array.from(urls).map((url, index) => (
          <div key={index} title={`${url} öffnen`}>
            <StyledOpenInNewIcon onClick={() => window.open(url, '_blank')} />
          </div>
        ))}
      </Container>
    )
  }
}

export default TextFieldWithUrl
