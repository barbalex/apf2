// @flow
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

const DateFieldContainer = styled.div`
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
  // dateStringValue is shown to user
  withState(`dateStringValue`, `changeDateStringValue`, (props) =>
    props.dateValue ?
    format(props.dateValue, `DD.MM.YYYY`) :
    ``
  ),
  // on bluring the fields, changes are only written do db if value has changed
  // so when the field is focused the value is saved to state in order to know
  // if it has changed on blur
  withState(`yearValueOnFocus`, `changeYearValueOnFocus`, ``),
  withState(`dateValueOnFocus`, `changeDateValueOnFocus`, ``),
  withHandlers({
    onBlurYear: props => (event) => {
      const {
        yearFieldName,
        dateFieldName,
        dateValue,
        changeDateStringValue,
        updateProperty,
        updatePropertyInDb,
        yearValueOnFocus,
      } = props
      const { value } = event.target
      // only update if value has changed
      if (value != yearValueOnFocus) {  // eslint-disable-line eqeqeq
        updatePropertyInDb(yearFieldName, value)
        // nullify date
        if (dateValue) {
          updateProperty(dateFieldName, null)
          updatePropertyInDb(dateFieldName, null)
          changeDateStringValue(``)
        }
      }
    },
    onChangeDatePicker: props => (event, val) => {
      const {
        yearFieldName,
        dateFieldName,
        yearValue,
        updateProperty,
        updatePropertyInDb,
        changeDateStringValue,
      } = props
      // date picker returns a val that is a date
      updateProperty(dateFieldName, format(val, `YYYY-MM-DD`))
      updatePropertyInDb(dateFieldName, format(val, `YYYY-MM-DD`))
      changeDateStringValue(format(val, `DD.MM.YYYY`))
      // set year
      const year = format(val, `YYYY`)
      if (yearValue !== year) {
        updatePropertyInDb(yearFieldName, year)
      }
    },
    onChangeDate: props =>
      (event, val) => props.changeDateStringValue(val),
    onBlurDate: props =>
      (event) => {
        const { value } = event.target
          const {
            yearFieldName,
            dateFieldName,
            yearValue,
            updatePropertyInDb,
            changeDateStringValue,
            dateValueOnFocus,
          } = props
        // only update if value has changed
        if (value != dateValueOnFocus) {  // eslint-disable-line eqeqeq
          if (!value) {
            // avoid creating an invalid date
            updatePropertyInDb(dateFieldName, null)
            changeDateStringValue(``)
            // set year
            if (yearValue !== null) {
              updatePropertyInDb(yearFieldName, null)
            }
          } else {
            // write a real date to db
            const date = new Date(convertDateToYyyyMmDd(value))
            updatePropertyInDb(dateFieldName, format(date, `YYYY-MM-DD`))
            changeDateStringValue(format(date, `DD.MM.YYYY`))
            // set year
            const year = format(date, `YYYY`)
            if (yearValue !== year) {
              updatePropertyInDb(yearFieldName, year)
            }
          }
        }
      },
    onFocusYear: props =>
      () =>
        props.changeYearValueOnFocus(props.yearValue),
    onFocusDate: props =>
      () =>
        props.changeDateValueOnFocus(props.dateValue),
  }),
  observer
)

class YearDatePair extends Component {

  static propTypes = {
    yearLabel: PropTypes.string.isRequired,
    yearFieldName: PropTypes.string.isRequired,
    yearValue: PropTypes.any,
    yearValueOnFocus: PropTypes.any,
    yearErrorText: PropTypes.string,
    dateLabel: PropTypes.string.isRequired,
    dateFieldName: PropTypes.string.isRequired,
    dateValue: PropTypes.any,
    dateStringValue: PropTypes.any,
    dateValueOnFocus: PropTypes.any,
    dateErrorText: PropTypes.string,
    updateProperty: PropTypes.func.isRequired,
    updatePropertyInDb: PropTypes.func.isRequired,
    onBlurYear: PropTypes.func.isRequired,
    onChangeDate: PropTypes.func.isRequired,
    onChangeDatePicker: PropTypes.func.isRequired,
    onBlurDate: PropTypes.func.isRequired,
    onFocusYear: PropTypes.func.isRequired,
    onFocusDate: PropTypes.func.isRequired,
    changeDateStringValue: PropTypes.func.isRequired,
  }

  static defaultProps = {
    yearValue: ``,
    yearValueOnFocus: ``,
    yearErrorText: ``,
    dateValue: ``,
    dateStringValue: ``,
    dateValueOnFocus: ``,
    dateErrorText: ``,
  }

  render() {
    const {
      yearLabel,
      yearFieldName,
      yearValue,
      yearErrorText,
      dateLabel,
      dateValue,
      dateStringValue,
      dateErrorText,
      updateProperty,
      onBlurYear,
      onChangeDate,
      onChangeDatePicker,
      onBlurDate,
      onFocusYear,
      onFocusDate,
    } = this.props
    const dateValueObject = dateValue ? new Date(dateValue) : {}

    return (
      <div>
        <TextField
          floatingLabelText={yearLabel}
          type="number"
          value={yearValue || ``}
          errorText={yearErrorText}
          fullWidth
          onChange={(event, val) =>
            updateProperty(yearFieldName, val)
          }
          onBlur={onBlurYear}
          onFocus={onFocusYear}
        />
        <DateFieldContainer>
          <TextField
            floatingLabelText={dateLabel}
            type="text"
            value={dateStringValue}
            errorText={dateErrorText}
            fullWidth
            onChange={onChangeDate}
            onBlur={onBlurDate}
            onFocus={onFocusDate}
          />
          <StyledFontIcon
            id="iconCalendar"
            className="material-icons"
            title="Kalender öffnen"
            // $FlowIssue
            onClick={() => this.datePicker.focus()}
          >
            event
          </StyledFontIcon>
          <DatePickerDiv>
            <DatePicker
              id="dataPicker"
              floatingLabelText={``}
              value={dateValueObject}
              errorText={dateErrorText}
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
        </DateFieldContainer>
      </div>
    )
  }
}

export default enhance(YearDatePair)
