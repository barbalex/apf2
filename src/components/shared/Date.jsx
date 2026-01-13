import { useState, useEffect } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { DateTime } from 'luxon'
import DatePicker from 'react-datepicker'

import styles from './Date.module.css'

const dateFormat = [
  'dd.MM.yyyy',
  'd.MM.yyyy',
  'd.M.yyyy',
  'dd.M.yyyy',
  'dd.MM.yy',
  'd.MM.yy',
  'd.M.yy',
  'dd.M.yy',
  'd.M',
  'd.MM',
  'dd.M',
  'dd.MM',
  'd',
  'dd',
]

export const DateField = ({
  value: valuePassed,
  name,
  label,
  saveToDb,
  error,
  popperPlacement = 'bottom',
}) => {
  const [stateValue, setStateValue] = useState(valuePassed)
  useEffect(() => {
    setStateValue(valuePassed)
  }, [valuePassed])

  // TODO:
  // onChange NOT WORKING when clicking in field and typing other date
  // BUT IT WORKS JUST FINE IN VERMEHRUNG.CH AND ARTEIGENSCHAFTEN.CH
  // tried using onChangeRaw instead of onChange but then I need to parse the date myself...
  // seems that moment(value) might work: https://github.com/Hacker0x01/react-datepicker/issues/1446#issuecomment-411791832
  // but who wants to load that beast?
  // After giving up and setting back, SUDDENLY IT WORKS ????!!!!

  const onChangeDatePicker = (date) => {
    const newValue =
      date === null ? null : DateTime.fromJSDate(date).toFormat('yyyy-LL-dd')
    setStateValue(newValue)
    saveToDb({
      target: {
        value: newValue,
        name,
      },
    })
  }

  // const onChangeDatePickerRaw = (e) => {
  //   const dateString = e.target.value
  //   console.log('DateField, onChangeDatePicker, dateString:', dateString)
  //   const newValue =
  //     dateString === '' ? null : (
  //       DateTime.fromFormat(dateString, 'dd.MM.jjjj').toFormat('yyyy-LL-dd') // not working
  //     )
  //   console.log('DateField, onChangeDatePicker, newValue:', newValue)
  //   setStateValue(newValue)
  //   saveToDb({
  //     target: {
  //       value: newValue,
  //       name,
  //     },
  //   })
  // }

  const isValid = DateTime.fromSQL(stateValue).isValid
  const selected = isValid ? new Date(DateTime.fromSQL(stateValue)) : null

  // console.log('DateField', { stateValue, selected, isValid })

  // for popperPlacement see https://github.com/Hacker0x01/react-datepicker/issues/1246#issuecomment-361833919
  return (
    <FormControl
      variant="standard"
      className={styles.formControl}
    >
      {!!label && (
        <InputLabel
          htmlFor={name}
          className={styles.labelClass}
        >
          {label}
        </InputLabel>
      )}
      <DatePicker
        id={name}
        selected={selected}
        onChange={onChangeDatePicker}
        // onChangeRaw={onChangeDatePickerRaw}
        dateFormat={dateFormat}
        popperPlacement={popperPlacement}
        className={styles.datePicker}
      />
      {!!error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
