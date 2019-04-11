/**
 * for unknown reason need to set null
 * if set '' (as React wants) value is shown and set as Unknown :-(
 * setting null of cours makes react log errors
 */
import React, { useEffect, useState, useCallback } from 'react'
import { DatePicker } from 'material-ui-pickers'
import FormHelperText from '@material-ui/core/FormHelperText'
import moment from 'moment'
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
}) => {
  const [stateValue, setStateValue] = useState(
    isValid(propsValue) ? propsValue : null,
  )

  const onChange = useCallback(
    valuePassed => {
      let newValue = valuePassed
      if (newValue === '') newValue = null
      if (newValue) {
        newValue = moment(newValue, 'DD.MM.YYYY').format('YYYY-MM-DD')
      }
      // do nothing if value has not changed
      // otherwise in tpopfeldkontr year will be reset when null is passed
      // after focusing empty field
      if (newValue === stateValue) return

      if (newValue && newValue.includes('Invalid date')) {
        newValue = newValue.replace('Invalid date', 'Format: DD.MM.YYYY')
      }
      const fakeEvent = { target: { value: newValue, name } }
      saveToDb(fakeEvent)
      setStateValue(newValue)
    },
    [name],
  )

  const onBlur = useCallback(event => onChange(event.target.value))

  useEffect(() => {
    setStateValue(propsValue)
  }, [propsValue])

  const onKeyPress = useCallback(event => {
    if (event.key === 'Enter') {
      onBlur(event)
    }
  })

  return (
    <>
      <StyledDatePicker
        keyboard
        label={label}
        format="DD.MM.YYYY"
        value={stateValue}
        // change happens when data is picked in picker
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
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
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="off"
        data-id={name}
      />
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </>
  )
}

export default observer(DateFieldWithPicker)
