import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import DatePicker from 'material-ui/DatePicker'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withHandlers({
    onChange: props => (event, val) => {
      props.updateProperty(props.fieldName, format(val, `YYYY-MM-DD`))
      props.updatePropertyInDb(props.fieldName, format(val, `YYYY-MM-DD`))
    },
  }),
  observer
)

const MyDatePicker = ({
  label,
  value,
  errorText,
  disabled,
  onChange,
}) => {
  const valueDate = value ? new Date(value) : {}

  return (
    <DatePicker
      floatingLabelText={label}
      value={valueDate}
      errorText={errorText}
      disabled={disabled}
      DateTimeFormat={window.Intl.DateTimeFormat}
      locale="de-CH-1996"
      formatDate={v => format(v, `DD.MM.YYYY`)}
      autoOk
      fullWidth
      cancelLabel="schliessen"
      onChange={onChange}
    />
  )
}

MyDatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.any,
  errorText: PropTypes.string,
  disabled: PropTypes.bool,
  updateProperty: PropTypes.func.isRequired,
  updatePropertyInDb: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

MyDatePicker.defaultProps = {
  value: null,
  errorText: ``,
  disabled: false,
}

export default enhance(MyDatePicker)
