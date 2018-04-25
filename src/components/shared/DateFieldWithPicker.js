// @flow
/**
 * need textfield combined with datepicker
 * see for instance:
 * https://github.com/callemall/material-ui/issues/3933#issuecomment-234711632
 * Basic idea:
 * material-ui DatePicker is hidden by sizing it 0x0 pixels
 * instead, a textfield is shown and next to it a calendar icon
 * when this icon is clicked, focus is set to the DatePicker
 * which opens the calendar
 */
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
    onChange: ({
      updateProperty,
      updatePropertyInDb,
      tree,
      fieldName,
    }) => value => {
      updateProperty(tree, fieldName, format(value, 'YYYY-MM-DD'))
      updatePropertyInDb(tree, fieldName, format(value, 'YYYY-MM-DD'))
    },
    onBlur: ({
      tree,
      fieldName,
      updateProperty,
      updatePropertyInDb,
    }) => event => {
      const { value } = event.target
      if (!value || value === '0') {
        // avoid creating an invalid date
        updatePropertyInDb(tree, fieldName, null)
      } else {
        // write a real date to db
        const date = new Date(convertDateToYyyyMmDd(value))
        updatePropertyInDb(tree, fieldName, format(date, 'YYYY-MM-DD'))
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
    updatePropertyInDb: () => void,
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
