// @flow
/**
 * for unknown reason need to set null
 * if set '' (as React wants) value is shown and set as Unknown :-(
 * setting null of cours makes react log errors
 */
import React, { useEffect, useState, useCallback } from 'react'
import { DatePicker } from 'material-ui-pickers'
import FormHelperText from '@material-ui/core/FormHelperText'
import moment from 'moment'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

const StyledDatePicker = styled(DatePicker)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
  @media print {
    button {
      display: none;
    }
  }
`

const DateFieldWithPicker = ({
  label,
  name,
  value: propsValue,
  saveToDb,
  error,
}: {
  label: String,
  name: String,
  value?: String | Number,
  saveToDb: () => void,
  error: String,
}) => {
  const [stateValue, setStateValue] = useState(
    isValid(propsValue) ? propsValue : null,
  )

  const onChange = useCallback(
    valuePassed => {
      /**
       * change happens when data is picked in picker
       * so is never null or otherwise invalid
       * oops: it is null if clear button is clicked!
       */
      if (!moment(valuePassed).isValid()) {
        const fakeEvent = { target: { value: null, name } }
        saveToDb(fakeEvent)
        return setStateValue(null)
      }
      const newValue = format(new Date(valuePassed), 'yyyy-MM-dd')
      const fakeEvent = { target: { value: newValue, name } }
      saveToDb(fakeEvent)
      setStateValue(newValue)
    },
    [name],
  )
  const onBlur = useCallback(
    event => {
      const { value } = event.target
      // do not change anything of there are no values
      // test validity using moment because date-fns isValid('1') is false
      if (!moment(value).isValid()) {
        const fakeEvent = { target: { value: null, name } }
        saveToDb(fakeEvent)
        return setStateValue(null)
      }

      // write a real date to db
      /**
       * would prefer to use data-fns for this but is not yet possible, see:
       * https://github.com/date-fns/date-fns/issues/219
       *
       * Actually: moment not only parses the date. Which data-fns v2 can.
       * It also gets "3", "3.1", 3.1.17" and adds missing month / year from now
       * This is great and not possible with date-fns?
       * https://github.com/date-fns/date-fns/issues/219#issuecomment-424090895
       */
      const date = new Date(moment(value, 'DD.MM.YYYY').format('YYYY-MM-DD'))
      const newValue = format(date, 'yyyy-MM-dd')
      const fakeEvent = { target: { value: newValue, name } }
      saveToDb(fakeEvent)
      setStateValue(newValue)
    },
    [name],
  )

  useEffect(
    () => {
      setStateValue(propsValue)
    },
    [propsValue],
  )

  return (
    <>
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
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </>
  )
}

export default observer(DateFieldWithPicker)
