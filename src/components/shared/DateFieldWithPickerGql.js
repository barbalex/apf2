// @flow
import React, { Component } from 'react'
import DatePicker from 'material-ui-pickers/DatePicker'
import format from 'date-fns/format'
import styled from 'styled-components'

import convertDateToYyyyMmDd from '../../modules/convertDateToYyyyMmDd'

const StyledDatePicker = styled(DatePicker)`
padding-top: 
  padding-bottom: 9px !important;
  > div:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`

type Props = {
  label: String,
  value?: String | Number,
  saveToDb: () => void,
}

type State = {
  value: Number | String,
}

class MyDatePicker extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
    }
  }

  static defaultProps = {
    value: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { value: nextProps.value }
  }

  handleChange = value => {
    if (!value || value === '0') {
      this.props.saveToDb(null)
      this.setState({ value: null })
      return
    }
    const newValue = format(value, 'YYYY-MM-DD')
    this.props.saveToDb(newValue)
    this.setState({ value: newValue })
  }

  handleBlur = event => {
    const { saveToDb } = this.props
    const { value } = event.target
    if (!value || value === '0') {
      // avoid creating an invalid date
      saveToDb(null)
    } else {
      // write a real date to db
      const date = new Date(convertDateToYyyyMmDd(value))
      const newValue = format(date, 'YYYY-MM-DD')
      saveToDb(newValue)
      this.setState({ value: newValue })
    }
  }

  render() {
    const { label } = this.props

    return (
      <StyledDatePicker
        keyboard
        label={label}
        format="DD.MM.YYYY"
        value={this.state.value}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
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
    )
  }
}

export default MyDatePicker
