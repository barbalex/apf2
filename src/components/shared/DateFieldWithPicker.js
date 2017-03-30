// @flow
/**
 * need textfield combined with datepicker
 * see for instance:
 * https://github.com/callemall/material-ui/issues/3933#issuecomment-234711632
 * https://github.com/callemall/material-ui/blob/master/src/DatePicker/DatePicker.js
 */
import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import FontIcon from 'material-ui/FontIcon'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const StyledFontIcon = styled(FontIcon)`
  cursor: pointer;
  pointer-events: auto;
`
const DatePickerDiv = styled.div`
  width: 0;
  height: 0;
`

const enhance = compose(
  withHandlers({
    onChangeDatePicker: props => (event, val) => {
      props.updateProperty(props.fieldName, format(val, `YYYY-MM-DD`))
      props.updatePropertyInDb(props.fieldName, format(val, `YYYY-MM-DD`))
    },
    onChange: props =>
      (event, val) =>
        props.updateProperty(props.fieldName, val),
    onBlur: props =>
      (event) => {
        const { value } = event.target
        // only update if value has changed
        if (value != props.valueOnFocus) {  // eslint-disable-line eqeqeq
          props.updatePropertyInDb(props.fieldName, value)
        }
      },
  }),
  observer
)

class MyDatePicker extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    value: PropTypes.any,
    errorText: PropTypes.string,
    disabled: PropTypes.bool,
    updateProperty: PropTypes.func.isRequired,
    updatePropertyInDb: PropTypes.func.isRequired,
    onChangeDatePicker: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }

  static defaultProps = {
    value: null,
    errorText: ``,
    disabled: false,
  }

  render() {
    const {
      label,
      value,
      errorText,
      disabled,
      onChangeDatePicker,
      onChange,
      onBlur,
    } = this.props

    const valueDate = value ? new Date(value) : {}

    return (
      <Container>
        <TextField
          floatingLabelText={label}
          type="text"
          value={value || value === 0 ? value : ``}
          errorText={errorText}
          fullWidth
          onChange={onChange}
          onBlur={onBlur}
        />
        <StyledFontIcon
          id="iconEl"
          className="material-icons"
          onClick={() => this.datePicker.focus()}
        >
          info_outline
        </StyledFontIcon>
        <DatePickerDiv>
          <DatePicker
            floatingLabelText={label}
            value={valueDate}
            errorText={errorText}
            disabled={disabled}
            DateTimeFormat={window.Intl.DateTimeFormat}
            locale="de-CH-1996"
            formatDate={v => format(v, `DD.MM.YYYY`)}
            autoOk
            fullWidth
            cancelLabel="schliessen"
            onChange={onChangeDatePicker}
            // $FlowIssue
            ref={(c) => { this.datePicker = c }}
          />
        </DatePickerDiv>
      </Container>
    )
  }
}

export default enhance(MyDatePicker)
