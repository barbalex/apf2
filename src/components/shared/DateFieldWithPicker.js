// @flow
/**
 * need textfield combined with datepicker
 * see for instance:
 * https://github.com/callemall/material-ui/issues/3933#issuecomment-234711632
 * Basic idea:
 * material-ui DatePicker is hidden by sizing it 0x0 pixels
 * instead, a textfield is shown and next to it a calendar icon
 * when this icon is clicked, focus is set to the DatePicker
 * which opens the calendar
 */
import React, { Component } from 'react'
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
  margin-bottom: -15px;
  break-inside: avoid;
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
  // stringValue is shown to user
  withState('stringValue', 'changeStringValue', props =>
    format(props.value, 'DD.MM.YYYY')
  ),
  // on bluring the textfield, changes are only written do db if value has changed
  // so when the textfield is focused the value is saved to state in order to know
  // if it has changed on blur
  withState('valueOnFocus', 'changeValueOnFocus', ''),
  withHandlers({
    onChangeDatePicker: props => (event, val) => {
      props.updateProperty(
        props.tree,
        props.fieldName,
        format(val, 'YYYY-MM-DD')
      )
      props.updatePropertyInDb(
        props.tree,
        props.fieldName,
        format(val, 'YYYY-MM-DD')
      )
      props.changeStringValue(format(val, 'DD.MM.YYYY'))
    },
    onChange: props => (event, val) => props.changeStringValue(val),
    onBlur: props => event => {
      const { value } = event.target
      // only update if value has changed
      // eslint-disable-next-line eqeqeq
      if (value != props.valueOnFocus) {
        if (!value) {
          // avoid creating an invalid date
          props.updatePropertyInDb(props.tree, props.fieldName, null)
          props.changeStringValue('')
        } else {
          // write a real date to db
          const date = new Date(convertDateToYyyyMmDd(value))
          props.updatePropertyInDb(
            props.tree,
            props.fieldName,
            format(date, 'YYYY-MM-DD')
          )
          props.changeStringValue(format(date, 'DD.MM.YYYY'))
        }
      }
    },
    onFocus: props => () => props.changeValueOnFocus(props.value),
  }),
  observer
)

class MyDatePicker extends Component {
  props: {
    tree: Object,
    label: string,
    fieldName: string,
    value?: string | number,
    stringValue?: string | number,
    errorText?: string,
    disabled?: boolean,
    updateProperty: () => void,
    updatePropertyInDb: () => void,
    onChangeDatePicker: () => void,
    onChange: () => void,
    onBlur: () => void,
    onFocus: () => void,
  }

  datePicker: ?HTMLDivElement

  static defaultProps = {
    value: null,
    stringValue: '',
    errorText: '',
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
          value={stringValue || ''}
          errorText={errorText}
          disabled={disabled}
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
            floatingLabelText={''}
            value={valueDate}
            errorText={errorText}
            disabled={disabled}
            DateTimeFormat={window.Intl.DateTimeFormat}
            locale="de-CH-1996"
            formatDate={v => format(v, 'DD.MM.YYYY')}
            autoOk
            fullWidth
            cancelLabel="schliessen"
            onChange={onChangeDatePicker}
            ref={c => (this.datePicker = c)}
          />
        </DatePickerDiv>
      </Container>
    )
  }
}

export default enhance(MyDatePicker)
