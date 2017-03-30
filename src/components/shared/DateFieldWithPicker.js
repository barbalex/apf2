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
import withState from 'recompose/withState'
import styled from 'styled-components'

import convertDateToYyyyMmDd from '../../modules/convertDateToYyyyMmDd'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const StyledFontIcon = styled(FontIcon)`
  cursor: pointer;
  pointer-events: auto;
  font-size: 34px !important;
  margin-top: 15px;
`
const DatePickerDiv = styled.div`
  width: 0;
  height: 0;
`

const enhance = compose(
  withState(`valueOnFocus`, `changeValueOnFocus`, ``),
  // stringValue is shown to user
  withState(`stringValue`, `changeStringValue`, (props) => format(props.value, `DD.MM.YYYY`)),
  withHandlers({
    onChangeDatePicker: props => (event, val) => {
      props.updateProperty(props.fieldName, format(val, `YYYY-MM-DD`))
      props.updatePropertyInDb(props.fieldName, format(val, `YYYY-MM-DD`))
      props.changeStringValue(format(val, `DD.MM.YYYY`))
    },
    onChange: props =>
      (event, val) => props.changeStringValue(val),
    onBlur: props =>
      (event) => {
        const { value } = event.target
        // only update if value has changed
        if (value != props.valueOnFocus) {  // eslint-disable-line eqeqeq
          if (!value) {
            // avoid creating an invalid date
            props.updatePropertyInDb(props.fieldName, null)
            props.changeStringValue(``)
          } else {
            // write a real date to db
            const date = new Date(convertDateToYyyyMmDd(value))
            props.updatePropertyInDb(props.fieldName, format(date, `YYYY-MM-DD`))
            props.changeStringValue(format(date, `DD.MM.YYYY`))
          }
        }
      },
    onFocus: props =>
      () =>
        props.changeValueOnFocus(props.value),
  }),
  observer
)

class MyDatePicker extends Component {

  static propTypes = {
    label: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    value: PropTypes.any,
    stringValue: PropTypes.any,
    errorText: PropTypes.string,
    disabled: PropTypes.bool,
    updateProperty: PropTypes.func.isRequired,
    updatePropertyInDb: PropTypes.func.isRequired,
    onChangeDatePicker: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
  }

  static defaultProps = {
    value: null,
    stringValue: ``,
    errorText: ``,
    disabled: false,
  }

  render() {
    const {
      label,
      value,
      stringValue,
      errorText,
      disabled,
      onChangeDatePicker,
      onChange,
      onBlur,
      onFocus,
    } = this.props

    const valueDate = value ? new Date(value) : {}

    return (
      <Container>
        <TextField
          floatingLabelText={label}
          type="text"
          value={stringValue || ``}
          errorText={errorText}
          fullWidth
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <StyledFontIcon
          id="iconCalendar"
          className="material-icons"
          title="Kalender öffnen"
          onClick={() => this.datePicker.focus()}
        >
          event
        </StyledFontIcon>
        <DatePickerDiv>
          <DatePicker
            id="dataPicker"
            floatingLabelText={``}
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
