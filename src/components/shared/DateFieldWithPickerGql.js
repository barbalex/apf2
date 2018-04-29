// @flow
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import DatePicker from 'material-ui-pickers/DatePicker'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import styled from 'styled-components'

import convertDateToYyyyMmDd from '../../modules/convertDateToYyyyMmDd'

const StyledDatePicker = styled(DatePicker)`
padding-top: 
  padding-bottom: 9px !important;
  > div:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  withState('value', 'setValue', ({ value }) => value),
  withHandlers({
    onChange: ({ saveToDb, setValue }) => value => {
      setValue(format(value, 'YYYY-MM-DD'))
      saveToDb(format(value, 'YYYY-MM-DD'))
    },
    onBlur: ({ saveToDb, setValue }) => event => {
      const { value } = event.target
      if (!value || value === '0') {
        // avoid creating an invalid date
        saveToDb(null)
      } else {
        // write a real date to db
        const date = new Date(convertDateToYyyyMmDd(value))
        saveToDb(format(date, 'YYYY-MM-DD'))
        setValue(format(date, 'YYYY-MM-DD'))
      }
    },
  }),
  observer
)

class MyDatePicker extends Component {
  props: {
    label: String,
    value?: String | Number,
    saveToDb: () => void,
    onChange: () => void,
    onBlur: () => void,
  }

  static defaultProps = {
    value: null,
  }

  render() {
    const { label, value, onChange, onBlur } = this.props

    return (
      <StyledDatePicker
        keyboard
        label={label}
        format="DD.MM.YYYY"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
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
    )
  }
}

export default enhance(MyDatePicker)
