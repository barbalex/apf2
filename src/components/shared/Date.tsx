import { useState, useEffect, useRef } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Input from '@mui/material/Input'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { MdCalendarToday } from 'react-icons/md'
import { DateTime } from 'luxon'
import DatePicker from 'react-datepicker'

import styles from './Date.module.css'

export const DateField = ({
  value: valuePassed,
  name,
  label,
  saveToDb,
  error,
  popperPlacement = 'bottom',
}) => {
  const [stateValue, setStateValue] = useState(valuePassed)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const datePickerRef = useRef(null)

  useEffect(() => {
    setStateValue(valuePassed)
    // Format the value for display in the input field
    if (valuePassed) {
      const dt = DateTime.fromSQL(valuePassed)
      if (dt.isValid) {
        setInputValue(dt.toFormat('dd.MM.yyyy'))
      }
    } else {
      setInputValue('')
    }
  }, [valuePassed])

  const saveDate = (newValue) => {
    setStateValue(newValue)
    saveToDb({
      target: {
        value: newValue,
        name,
      },
    })
  }

  const onChangeDatePicker = (date) => {
    if (date === null) {
      setInputValue('')
      saveDate(null)
    } else {
      const newValue = DateTime.fromJSDate(date).toFormat('yyyy-LL-dd')
      const displayValue = DateTime.fromJSDate(date).toFormat('dd.MM.yyyy')
      setInputValue(displayValue)
      saveDate(newValue)
    }
    setIsPickerOpen(false)
  }

  const onChangeInput = (e) => {
    setInputValue(e.target.value)
  }

  const onBlurInput = (e) => {
    const dateString = e.target.value.trim()

    // If empty, save null and return
    if (!dateString) {
      saveDate(null)
      return
    }

    // Get current date
    const now = DateTime.now()
    const currentMonth = now.toFormat('MM')
    const currentYear = now.toFormat('yyyy')
    const centuryPrefix = currentYear.substring(0, 2) // "20" for 2026

    let completedDate = dateString

    // Pattern 1: Day, month, and any year (d.m.y* or dd.mm.y*)
    // Matches: "1.1.1", "5.3.26", "15.03.26", "15.3.026"
    const dayMonthYearPattern = /^(\d{1,2})\.(\d{1,2})\.(\d{1,3})$/
    const dayMonthYearMatch = dateString.match(dayMonthYearPattern)

    if (dayMonthYearMatch) {
      const day = dayMonthYearMatch[1].padStart(2, '0')
      const month = dayMonthYearMatch[2].padStart(2, '0')
      const yearInput = dayMonthYearMatch[3]

      // Expand year based on number of digits
      let year
      if (yearInput.length === 1) {
        // 1 digit: prepend current century and pad (e.g., "1" -> "2001")
        year = `${centuryPrefix}0${yearInput}`
      } else if (yearInput.length === 2) {
        // 2 digits: prepend current century (e.g., "26" -> "2026")
        year = `${centuryPrefix}${yearInput}`
      } else if (yearInput.length === 3) {
        // 3 digits: prepend first digit of century (e.g., "026" -> "2026")
        year = `${centuryPrefix.charAt(0)}${yearInput}`
      }

      completedDate = `${day}.${month}.${year}`
    }
    // Pattern 2: Just day (1-2 digits) - add current month and year
    // Matches: "5", "15", "05"
    else {
      const dayOnlyPattern = /^(\d{1,2})$/
      const dayOnlyMatch = dateString.match(dayOnlyPattern)

      if (dayOnlyMatch) {
        const day = dayOnlyMatch[1].padStart(2, '0')
        completedDate = `${day}.${currentMonth}.${currentYear}`
      }
      // Pattern 3: Day and month (d.m or dd.mm) - add current year
      // Matches: "5.3", "15.03", "05.3", "15.3"
      else {
        const dayMonthPattern = /^(\d{1,2})\.(\d{1,2})$/
        const dayMonthMatch = dateString.match(dayMonthPattern)

        if (dayMonthMatch) {
          const day = dayMonthMatch[1].padStart(2, '0')
          const month = dayMonthMatch[2].padStart(2, '0')
          completedDate = `${day}.${month}.${currentYear}`
        }
      }
    }

    // Parse and save the completed date
    const parsedDate = DateTime.fromFormat(completedDate, 'dd.MM.yyyy')
    if (parsedDate.isValid) {
      const newValue = parsedDate.toFormat('yyyy-LL-dd')
      setInputValue(completedDate)
      saveDate(newValue)
    } else {
      // If invalid, restore the previous value
      if (stateValue) {
        const dt = DateTime.fromSQL(stateValue)
        if (dt.isValid) {
          setInputValue(dt.toFormat('dd.MM.yyyy'))
        }
      } else {
        setInputValue('')
      }
    }
  }

  const isValid = DateTime.fromSQL(stateValue).isValid
  const selected = isValid ? new Date(DateTime.fromSQL(stateValue)) : null

  return (
    <FormControl variant="standard" className={styles.formControl}>
      {!!label && (
        <InputLabel htmlFor={name} className={styles.labelClass}>
          {label}
        </InputLabel>
      )}
      <Input
        id={name}
        value={inputValue}
        onChange={onChangeInput}
        onBlur={onBlurInput}
        placeholder="dd.mm.yyyy"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              edge="end"
              size="small"
            >
              <MdCalendarToday />
            </IconButton>
          </InputAdornment>
        }
      />
      {isPickerOpen && (
        <div className={styles.inlinePickerWrapper}>
          <DatePicker
            ref={datePickerRef}
            selected={selected}
            onChange={onChangeDatePicker}
            onClickOutside={() => setIsPickerOpen(false)}
            popperPlacement={popperPlacement}
            inline
          />
        </div>
      )}
      {!!error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
