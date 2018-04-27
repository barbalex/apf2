// @flow
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import DatePicker from 'material-ui-pickers/DatePicker'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import convertDateToYyyyMmDd from '../../modules/convertDateToYyyyMmDd'

const StyledDatePicker = styled(DatePicker)`
  padding-bottom: 9px !important;
  > div:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  withHandlers({
    onChange: ({ updateProperty, saveToDb, tree, fieldName }) => value => {
      updateProperty(tree, fieldName, format(value, 'YYYY-MM-DD'))
      saveToDb(format(value, 'YYYY-MM-DD'))
    },
    onBlur: ({ tree, fieldName, updateProperty, saveToDb }) => event => {
      const { value } = event.target
      if (!value || value === '0') {
        // avoid creating an invalid date
        saveToDb(null)
      } else {
        // write a real date to db
        const date = new Date(convertDateToYyyyMmDd(value))
        saveToDb(format(date, 'YYYY-MM-DD'))
      }
    },
  }),
  observer
)

class MyDatePicker extends Component {
  props: {
    tree: Object,
    label: string,
    fieldName: string,
    value?: string | number,
    updateProperty: () => void,
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
