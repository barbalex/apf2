// @flow
import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withHandlers({
    onBlurYear: props => (event) => {
      const {
        yearFieldName,
        dateFieldName,
        dateValue,
        updateProperty,
        updatePropertyInDb,
      } = props

      updatePropertyInDb(yearFieldName, event.target.value)
      // nullify date
      if (dateValue) {
        updateProperty(dateFieldName, null)
        updatePropertyInDb(dateFieldName, null)
      }
    },
    onChangeDate: props => (event, value) => {
      const {
        yearFieldName,
        yearValue,
        dateFieldName,
        updateProperty,
        updatePropertyInDb,
      } = props

      updateProperty(dateFieldName, format(value, `YYYY-MM-DD`))
      updatePropertyInDb(dateFieldName, format(value, `YYYY-MM-DD`))
      // set year
      const year = format(value, `YYYY`)
      if (yearValue !== year) {
        updatePropertyInDb(yearFieldName, year)
      }
    },
  }),
  observer
)

const YearDatePair = ({
  yearLabel,
  yearFieldName,
  yearValue,
  yearErrorText,
  dateLabel,
  dateValue,
  dateErrorText,
  updateProperty,
  onBlurYear,
  onChangeDate,
}) => {
  const dateValueObject = dateValue ? new Date(dateValue) : {}
  return (
    <div>
      <TextField
        floatingLabelText={yearLabel}
        type="number"
        value={yearValue || ``}
        errorText={yearErrorText}
        fullWidth
        onChange={(event, val) =>
          updateProperty(yearFieldName, val)
        }
        onBlur={onBlurYear}
      />
      <DatePicker
        floatingLabelText={dateLabel}
        value={dateValueObject}
        errorText={dateErrorText}
        DateTimeFormat={window.Intl.DateTimeFormat}
        locale="de-CH-1996"
        formatDate={v => format(v, `DD.MM.YYYY`)}
        autoOk
        fullWidth
        cancelLabel="schliessen"
        onChange={onChangeDate}
      />
    </div>
  )
}

YearDatePair.propTypes = {
  yearLabel: PropTypes.string.isRequired,
  yearFieldName: PropTypes.string.isRequired,
  yearValue: PropTypes.any,
  yearErrorText: PropTypes.string,
  dateLabel: PropTypes.string.isRequired,
  dateFieldName: PropTypes.string.isRequired,
  dateValue: PropTypes.any,
  dateErrorText: PropTypes.string,
  updateProperty: PropTypes.func.isRequired,
  updatePropertyInDb: PropTypes.func.isRequired,
  onBlurYear: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
}

YearDatePair.defaultProps = {
  yearValue: ``,
  yearErrorText: ``,
  dateValue: ``,
  dateErrorText: ``,
}

export default enhance(YearDatePair)
