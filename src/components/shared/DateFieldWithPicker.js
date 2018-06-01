// @flow
import React from 'react'
import DatePicker from 'material-ui-pickers/DatePicker'
import format from 'date-fns/format'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withLifecycle from '@hocs/with-lifecycle'

import convertDateToYyyyMmDd from '../../modules/convertDateToYyyyMmDd'

const StyledDatePicker = styled(DatePicker)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  withState(
    'stateValue',
    'setStateValue',
    ({ value: propsValue }) =>
      (propsValue || propsValue === 0) ? propsValue : ''
  ),
  withHandlers({
    onChange: ({ setStateValue, saveToDb }) => value =>{
      /**
      * change happens when data is picked in picker
      * so is never null
      */
      const newValue = format(value, 'YYYY-MM-DD')
      saveToDb(newValue)
      setStateValue(newValue)
    },
    onBlur: ({ saveToDb, stateValue, setStateValue }) => event => {
      const { value } = event.target
      // do not change anything of there are no values
      if (stateValue === null && value === '') return

      // avoid creating an invalid date which happens
      // when falsy values are passed
      if (!value || value === '0') return saveToDb(null)

      // write a real date to db
      const date = new Date(convertDateToYyyyMmDd(value))
      const newValue = format(date, 'YYYY-MM-DD')
      saveToDb(newValue)
      setStateValue(newValue)
      /**
       * TODO
       * When manually re-inserting the same data already existing,
       * it is not re-rendered?
       */
      },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (props.value !== prevProps.value) {
        props.setStateValue(props.value)
      }
    },
  }),
)

const DateFieldWithPicker = ({
  label,
  value: propsValue,
  stateValue,
  saveToDb,
  onChange,
  onBlur,
}:{
  label: String,
  value?: String | Number,
  stateValue?: String | Number,
  saveToDb: () => void,
  onChange: () => void,
  onBlur: () => void,
}) =>
  <StyledDatePicker
    keyboard
    label={label}
    format="DD.MM.YYYY"
    value={stateValue}
    onChange={onChange}
    onBlur={onBlur}
    disableOpenOnEnter
    animateYearScrolling={false}
    autoOk
    // remove message because dont want it when user
    // enters only day and maybe month
    // need a value because seems that too expects one
    invalidDateMessage=" "
    cancelLabel="schliessen"
    okLabel="speichern"
    fullWidth
  />


export default enhance(DateFieldWithPicker)
