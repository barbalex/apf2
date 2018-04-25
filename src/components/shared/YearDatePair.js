// @flow
/**
 * When calling this component it is necessary to give it the key
 * of the parent dataset to force remounting when that dataset is changed.
 *
 * If not, when you create a new dataset, it will show the date of the last
 * because component does not mount again
 * and previous changeDateStringValue remains
 */
import React from 'react'
import { observer } from 'mobx-react'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import DatePicker from 'material-ui-pickers/DatePicker'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import convertDateToYyyyMmDd from '../../modules/convertDateToYyyyMmDd'

const StyledInput = styled(Input)`
  &:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const StyledDatePicker = styled(DatePicker)`
  padding-bottom: 9px !important;
  > div:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  withHandlers({
    onBlurYear: ({
      tree,
      yearFieldName,
      dateFieldName,
      dateValue,
      updateProperty,
      updatePropertyInDb,
    }) => event => {
      const { value } = event.target
      console.log('onBlurYear:', {
        yearFieldName,
        dateFieldName,
        dateValue,
        value,
      })
      updatePropertyInDb(tree, yearFieldName, value)
      // nullify date
      updateProperty(tree, dateFieldName, null)
      updatePropertyInDb(tree, dateFieldName, null)
    },
    onChangeDatePicker: ({
      tree,
      yearFieldName,
      dateFieldName,
      yearValue,
      updateProperty,
      updatePropertyInDb,
    }) => val => {
      // date picker returns a val that is a date
      updateProperty(tree, dateFieldName, format(val, 'YYYY-MM-DD'))
      updatePropertyInDb(tree, dateFieldName, format(val, 'YYYY-MM-DD'))
      // set year
      const year = format(val, 'YYYY')
      if (yearValue !== year) {
        updatePropertyInDb(tree, yearFieldName, year)
      }
    },
    onBlurDate: ({
      tree,
      yearFieldName,
      dateFieldName,
      yearValue,
      updatePropertyInDb,
    }) => event => {
      const { value } = event.target
      // only update if value has changed
      // there is a weird case wherevalue is ''
      // which led to year being deleted when focus moved out of date!
      if (!value) return
      if (!value) {
        // avoid creating an invalid date
        updatePropertyInDb(tree, dateFieldName, null)
        // set year
        if (yearValue !== null) {
          updatePropertyInDb(tree, yearFieldName, null)
        }
      } else {
        // write a real date to db
        const date = new Date(convertDateToYyyyMmDd(value))
        updatePropertyInDb(tree, dateFieldName, format(date, 'YYYY-MM-DD'))
        // set year
        const year = format(date, 'YYYY')
        if (yearValue !== year) {
          updatePropertyInDb(tree, yearFieldName, year)
        }
      }
    },
  }),
  observer
)

const YearDatePair = ({
  tree,
  yearLabel,
  yearFieldName,
  yearValue,
  yearErrorText,
  dateLabel,
  dateFieldName,
  dateValue,
  dateErrorText,
  updateProperty,
  updatePropertyInDb,
  onBlurYear,
  onChangeDatePicker,
  onBlurDate,
}: {
  tree: Object,
  yearLabel: string,
  yearFieldName: string,
  yearValue?: ?number | ?string,
  yearErrorText?: string,
  dateLabel: string,
  dateFieldName: string,
  dateValue?: ?number | ?string,
  dateErrorText?: string,
  updateProperty: () => void,
  updatePropertyInDb: () => void,
  onBlurYear: () => void,
  onChangeDatePicker: () => void,
  onBlurDate: () => void,
}) => (
  <div>
    <FormControl
      error={!!yearErrorText}
      fullWidth
      aria-describedby={`${yearLabel}-helper`}
    >
      <InputLabel htmlFor={yearLabel}>{yearLabel}</InputLabel>
      <StyledInput
        id={yearLabel}
        value={yearValue || ''}
        type="number"
        onChange={event =>
          updateProperty(tree, yearFieldName, event.target.value)
        }
        onBlur={onBlurYear}
      />
      <FormHelperText id={`${yearLabel}-helper`}>
        {yearErrorText}
      </FormHelperText>
    </FormControl>
    <StyledDatePicker
      keyboard
      label={dateLabel}
      format="DD.MM.YYYY"
      value={dateValue}
      onChange={onChangeDatePicker}
      onBlur={onBlurDate}
      disableOpenOnEnter
      animateYearScrolling={false}
      autoOk
      // remove message because dont want it when user
      // enters ony day and maybe month
      // need a value because seems that too expects one
      invalidDateMessage=" "
      cancelLabel="schliessen"
      okLabel="speichern"
      fullWidth
    />
  </div>
)

export default enhance(YearDatePair)
