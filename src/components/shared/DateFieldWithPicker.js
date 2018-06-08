// @flow
/**
 * for unknown reason need to set null
 * if set '' (as React wants) value is shown and set as Unknown :-(
 * setting null of cours makes react log errors
 */
import React, { Fragment } from 'react'
import DatePicker from 'material-ui-pickers/DatePicker'
import FormHelperText from '@material-ui/core/FormHelperText'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
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
    ({ value: propsValue }) => isValid(propsValue) ? propsValue : null
  ),
  withHandlers({
    onChange: ({ setStateValue, saveToDb }) => value =>{
      /**
      * change happens when data is picked in picker
      * so is never null or otherwise invalid
      * oops: it is null if clear button is clicked!
      */
      //console.log('DateFieldWithPicker, onChange:', {value})
      if (!isValid(value)) {
        saveToDb(null)
        return setStateValue(null)
      }
      const newValue = format(value, 'YYYY-MM-DD')
      saveToDb(newValue)
      setStateValue(newValue)
    },
    onBlur: ({ saveToDb, stateValue, setStateValue, value: propsValue }) => event => {
      const { value } = event.target
      //console.log('DateFieldWithPicker, onBlur:', {value})
      // do not change anything of there are no values
      if (!isValid(value)) {
        //console.log('invalid value, propsValue:', propsValue)
        saveToDb(null)
        return setStateValue(null)
      }

      // write a real date to db
      const date = new Date(convertDateToYyyyMmDd(value))
      const newValue = format(date, 'YYYY-MM-DD')
      saveToDb(newValue)
      setStateValue(newValue)
      },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (props.value !== prevProps.value) {
        //console.log('DateFieldWithPicker, onDidUpdate, setting state to:', props.value)
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
  error,
}:{
  label: String,
  value?: String | Number,
  stateValue?: String | Number,
  saveToDb: () => void,
  onChange: () => void,
  onBlur: () => void,
  error: String,
}) => {
  //console.log('DateFieldWithPicker, render:', {stateValue})
  return (
    <Fragment>
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
        clearable={true}
        clearLabel="leeren"
        // remove message because dont want it when user
        // enters only day and maybe month
        // need a value because seems that too expects one
        invalidDateMessage=" "
        cancelLabel="schliessen"
        okLabel="speichern"
        fullWidth
      />
      {
        !!error &&
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      }
    </Fragment>
  )
}


export default enhance(DateFieldWithPicker)
