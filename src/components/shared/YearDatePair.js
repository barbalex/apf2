// @flow
/**
 * When calling this component it is necessary to give it the key
 * of the parent dataset to force remounting when that dataset is changed.
 *
 * If not, when you create a new dataset, it will show the date of the last
 * because component does not mount again
 * and previous changeDateStringValue remains
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
import withLifecycle from '@hocs/with-lifecycle'
import styled from 'styled-components'

import convertDateToYyyyMmDd from '../../modules/convertDateToYyyyMmDd'

const DateFieldContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  break-inside: avoid;
`
const YearTextField = styled(TextField)`
  margin-bottom: -15px;
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
  withState(
    'dateStringValue',
    'changeDateStringValue',
    props => (props.dateValue ? format(props.dateValue, 'DD.MM.YYYY') : '')
  ),
  // on bluring the fields, changes are only written do db if value has changed
  // so when the field is focused the value is saved to state in order to know
  // if it has changed on blur
  withState('yearValueOnFocus', 'changeYearValueOnFocus', ''),
  withState('dateValueOnFocus', 'changeDateValueOnFocus', ''),
  withHandlers({
    onBlurYear: props => event => {
      const {
        tree,
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
      // eslint-disable-next-line eqeqeq
      if (value != yearValueOnFocus) {
        updatePropertyInDb(tree, yearFieldName, value)
        // nullify date
        if (dateValue) {
          updateProperty(props.tree, dateFieldName, null)
          updatePropertyInDb(tree, dateFieldName, null)
          changeDateStringValue('')
        }
      }
    },
    onChangeDatePicker: props => (event, val) => {
      const {
        tree,
        yearFieldName,
        dateFieldName,
        yearValue,
        updateProperty,
        updatePropertyInDb,
        changeDateStringValue,
      } = props
      // date picker returns a val that is a date
      updateProperty(props.tree, dateFieldName, format(val, 'YYYY-MM-DD'))
      updatePropertyInDb(tree, dateFieldName, format(val, 'YYYY-MM-DD'))
      changeDateStringValue(format(val, 'DD.MM.YYYY'))
      // set year
      const year = format(val, 'YYYY')
      if (yearValue !== year) {
        updatePropertyInDb(tree, yearFieldName, year)
      }
    },
    onChangeDate: props => (event, val) => props.changeDateStringValue(val),
    onBlurDate: props => event => {
      const { value } = event.target
      const {
        tree,
        yearFieldName,
        dateFieldName,
        yearValue,
        updatePropertyInDb,
        changeDateStringValue,
        dateValueOnFocus,
      } = props
      // only update if value has changed
      // there is a weird case where dateValueOnFocus is null and value is ''
      // which led to year being deleted when focus moved out of date!
      if (!dateValueOnFocus && !value) return
      // eslint-disable-next-line eqeqeq
      if (value != dateValueOnFocus) {
        if (!value) {
          // avoid creating an invalid date
          updatePropertyInDb(tree, dateFieldName, null)
          changeDateStringValue('')
          // set year
          if (yearValue !== null) {
            updatePropertyInDb(tree, yearFieldName, null)
          }
        } else {
          // write a real date to db
          const date = new Date(convertDateToYyyyMmDd(value))
          updatePropertyInDb(tree, dateFieldName, format(date, 'YYYY-MM-DD'))
          changeDateStringValue(format(date, 'DD.MM.YYYY'))
          // set year
          const year = format(date, 'YYYY')
          if (yearValue !== year) {
            updatePropertyInDb(tree, yearFieldName, year)
          }
        }
      }
    },
    onFocusYear: props => () => props.changeYearValueOnFocus(props.yearValue),
    onFocusDate: props => () => props.changeDateValueOnFocus(props.dateValue),
  }),
  withLifecycle({
    onDidMount({ dateValue }) {
      console.log('YearDatePair did mount: dataValue:', dateValue)
    },
  }),
  observer
)

class YearDatePair extends Component {
  props: {
    tree: Object,
    yearLabel: string,
    yearFieldName: string,
    yearValue?: ?number | ?string,
    yearValueOnFocus?: ?number | ?string,
    yearErrorText?: string,
    dateLabel: string,
    dateFieldName: string,
    dateValue?: ?number | ?string,
    dateStringValue?: ?number | ?string,
    dateValueOnFocus?: ?number | ?string,
    dateErrorText?: string,
    updateProperty: () => void,
    updatePropertyInDb: () => void,
    onBlurYear: () => void,
    onChangeDate: () => void,
    onChangeDatePicker: () => void,
    onBlurDate: () => void,
    onFocusYear: () => void,
    onFocusDate: () => void,
    changeDateStringValue: () => void,
  }

  static defaultProps = {
    yearValue: '',
    yearErrorText: '',
    dateValue: '',
    dateErrorText: '',
  }

  render() {
    const {
      tree,
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
    // console.log('YearDatePair rendering: dateValue:', dateValue)
    // console.log('YearDatePair rendering: dateStringValue:', dateStringValue)

    return (
      <div>
        <YearTextField
          floatingLabelText={yearLabel}
          type="number"
          value={yearValue || ''}
          errorText={yearErrorText}
          fullWidth
          onChange={(event, val) => updateProperty(tree, yearFieldName, val)}
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
              floatingLabelText={''}
              value={dateValue ? new Date(dateValue) : {}}
              errorText={dateErrorText}
              DateTimeFormat={window.Intl.DateTimeFormat}
              locale="de-CH-1996"
              formatDate={v => format(v, 'DD.MM.YYYY')}
              autoOk
              fullWidth
              cancelLabel="schliessen"
              onChange={onChangeDatePicker}
              // $FlowIssue
              ref={c => (this.datePicker = c)}
            />
          </DatePickerDiv>
        </DateFieldContainer>
      </div>
    )
  }
}

export default enhance(YearDatePair)
