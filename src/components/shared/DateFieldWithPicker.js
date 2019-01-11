// @flow
/**
 * for unknown reason need to set null
 * if set '' (as React wants) value is shown and set as Unknown :-(
 * setting null of cours makes react log errors
 */
import React, { useEffect, useState, useCallback } from 'react'
import { DatePicker } from 'material-ui-pickers'
import FormHelperText from '@material-ui/core/FormHelperText'
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
    value => {
      /**
       * change happens when data is picked in picker
       * so is never null or otherwise invalid
       * oops: it is null if clear button is clicked!
       */
      if (!isValid(value)) {
        const fakeEvent = { target: { value: null, name } }
        saveToDb(fakeEvent)
        return setStateValue(null)
      }
      const newValue = format(value, 'YYYY-MM-DD')
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
      if (!isValid(value)) {
        const fakeEvent = { target: { value: null, name } }
        saveToDb(fakeEvent)
        return setStateValue(null)
      }

      // write a real date to db
      const date = format(new Date(), 'YYYY-MM-DD')
      const newValue = format(date, 'YYYY-MM-DD')
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
