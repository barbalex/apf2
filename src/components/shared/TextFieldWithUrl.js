// @flow
import React from 'react'
import { observer } from 'mobx-react'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import green from 'material-ui/colors/green'
/**
 * DO NOT UPDATE get-urls
 * before create-react-app moves to using babili
 * see: https://github.com/facebookincubator/create-react-app/issues/984#issuecomment-257105773
 * and: https://github.com/sindresorhus/get-urls/issues/17
 */
import getUrls from 'get-urls'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

const Container = styled.div`
  display: flex;
  margin-bottom: -15px;
  break-inside: avoid;
`
const StyledOpenInNewIcon = styled(OpenInNewIcon)`
  margin-top: 20px;
  cursor: pointer;
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

const MyTextFieldWithUrl = ({
  label,
  value,
  errorText,
  type,
  multiLine,
  disabled,
  onChange,
  onBlur,
}: {
  label: string,
  value?: ?number | ?string,
  errorText?: string,
  type?: string,
  multiLine?: boolean,
  disabled?: boolean,
  onChange: () => void,
  onBlur: () => void,
}) => {
  const urls = value ? getUrls(value) : []

  return (
    <Container>
      <FormControl
        error={!!errorText}
        disabled={disabled}
        fullWidth
        aria-describedby={`${label}-helper`}
      >
        <InputLabel htmlFor={label}>
          {`${label} (bitte "www." statt "https://" eingeben)`}
        </InputLabel>
        <StyledInput
          id={label}
          value={value || ''}
          type={type}
          multiline={multiLine}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <FormHelperText id={`${label}-helper`}>{errorText}</FormHelperText>
      </FormControl>
      {Array.from(urls).map((url, index) => (
        <div key={index} title={`${url} öffnen`}>
          <StyledOpenInNewIcon
            onClick={() => window.open(url, '_blank')}
            hoverColor={green[300]}
          />
        </div>
      ))}
    </Container>
  )
}

MyTextFieldWithUrl.defaultProps = {
  value: '',
  errorText: '',
  type: 'text',
  multiLine: false,
  disabled: false,
}

export default enhance(MyTextFieldWithUrl)
