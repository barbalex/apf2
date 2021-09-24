import React, { useCallback } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import { DateTime } from 'luxon'
import DatePicker from 'react-datepicker'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

const StyledFormControl = styled(FormControl)`
  margin-bottom: 19px !important;
  width: 100%;
  .react-datepicker-popper {
    z-index: 2;
  }
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__header {
    background-color: rgba(56, 142, 60, 0.1) !important;
  }
  &:focus-within label {
    color: #2e7d3 !important;
  }
`
const Label = styled(InputLabel)`
  font-size: 12px !important;
  height: 12px !important;
  color: rgb(0, 0, 0, 0.54);
  position: relative !important;
  transform: none !important;
`
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 0.25rem 0;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  min-height: 36px !important;
  height: 36px !important;
  background-color: transparent;
  &:focus {
    color: #495057;
    background-color: #fff;
    outline: 0;
    border-bottom: 2px solid #2e7d32;
    box-shadow: none;
    background-color: transparent;
  }
`
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

const DateField = ({
  value,
  name,
  label,
  saveToDb,
  error,
  popperPlacement = 'auto',
}) => {
  const onChangeDatePicker = useCallback(
    (date) => {
      if (date === null) {
        saveToDb({
          target: {
            value: null,
            name,
          },
        })
      } else {
        saveToDb({
          target: {
            value: DateTime.fromJSDate(date).toFormat('yyyy-LL-dd'),
            name,
          },
        })
      }
    },
    [name, saveToDb],
  )

  const isValid = DateTime.fromSQL(value).isValid
  const selected = isValid ? new Date(DateTime.fromSQL(value)) : null

  // for popperPlacement see https://github.com/Hacker0x01/react-datepicker/issues/1246#issuecomment-361833919
  return (
    <StyledFormControl variant="standard">
      {!!label && <Label htmlFor={name}>{label}</Label>}
      <StyledDatePicker
        id={name}
        selected={selected}
        onChange={onChangeDatePicker}
        dateFormat={dateFormat}
        popperPlacement={popperPlacement}
      />
      {!!error && <FormHelperText>{error}</FormHelperText>}
    </StyledFormControl>
  )
}

export default observer(DateField)
