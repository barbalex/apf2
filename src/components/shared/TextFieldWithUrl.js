// @flow
import React from 'react'
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField'
import FontIcon from 'material-ui/FontIcon'
import { greenA200 } from 'material-ui/styles/colors'
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
`
const StyledFontIcon = styled(FontIcon)`
  margin-top: 33px;
  cursor: pointer;
`

const enhance = compose(
  withState(`valueOnFocus`, `changeValueOnFocus`, ``),
  withHandlers({
    onChange: props => (event, val) =>
      props.updateProperty(props.tree, props.fieldName, val),
    onBlur: props => (event) => {
      const { value } = event.target
      // only update if value has changed
      if (value != props.valueOnFocus) {  // eslint-disable-line eqeqeq
        props.updatePropertyInDb(props.tree, props.fieldName, value)
      }
    },
    onFocus: props =>
      () =>
        props.changeValueOnFocus(props.value),
  }),
  observer
)

const MyTextFieldWithUrl = (
  {
    label,
    value,
    errorText,
    type,
    multiLine,
    disabled,
    onChange,
    onBlur,
    onFocus,
  }:
  {
    label: string,
    value?: ?number|?string,
    errorText?: string,
    type?: string,
    multiLine?: boolean,
    disabled?: boolean,
    onChange: () => void,
    onBlur: () => void,
    onFocus: () => void,
  }
) => {
  const urls = value ? getUrls(value) : []

  return (
    <Container>
      <TextField
        floatingLabelText={`${label} (bitte "www." statt "https://" eingeben)`}
        type={type}
        multiLine={multiLine}
        value={value || ``}
        errorText={errorText}
        disabled={disabled}
        fullWidth
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {
        Array.from(urls).map((url, index) => (
          <StyledFontIcon
            className={`material-icons`}
            onClick={() => window.open(url, `_blank`)}
            hoverColor={greenA200}
            title={`${url} öffnen`}
            key={index}
          >
            open_in_new
          </StyledFontIcon>
        ))
      }
    </Container>
  )
}

MyTextFieldWithUrl.defaultProps = {
  value: ``,
  valueOnFocus: ``,
  errorText: ``,
  type: `text`,
  multiLine: false,
  disabled: false,
}

export default enhance(MyTextFieldWithUrl)
