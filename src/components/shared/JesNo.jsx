import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'

import styles from './JesNo.module.css'

const dataSource = [
  {
    value: true,
    label: 'Ja',
  },
  {
    value: false,
    label: 'Nein',
  },
]

export const JesNo = ({
  label,
  helperText = '',
  saveToDb,
  value,
  name,
  error,
}) => {
  const onClickButton = (event) => {
    /**
     * if clicked element is active value: set null
     * Problem: does not work on change event on RadioGroup
     * because that only fires on changes
     * Solution: do this in click event of button
     */
    const targetValue = event.target.value === 'true'
    const fakeEvent = {
      target: {
        value: targetValue,
        name,
      },
    }
    if (targetValue === value) {
      // an already active option was clicked
      // set value null
      fakeEvent.target.value = null
    }
    // It is possible to directly click an option after editing an other field
    // this creates a race condition in the two submits which can lead to lost inputs!
    // so timeout inputs in option fields
    setTimeout(() => saveToDb(fakeEvent))
  }

  const onChangeGroup = (event) => {
    // group only changes if value changes
    const targetValue = event.target.value
    // values are passed as strings > need to convert
    const valueToUse =
      targetValue === 'true' ? true
      : targetValue === 'false' ? false
      : isNaN(targetValue) ? targetValue
      : +targetValue
    const fakeEvent = {
      target: {
        value: valueToUse,
        name,
      },
    }
    // It is possible to directly click an option after editing an other field
    // this creates a race condition in the two submits which can lead to lost inputs!
    // so timeout inputs in option fields
    setTimeout(() => saveToDb(fakeEvent))
  }

  const valueSelected =
    value !== null && value !== undefined ? value.toString() : ''

  return (
    <FormControl
      component="fieldset"
      error={!!error}
      aria-describedby={`${label}ErrorText`}
      variant="standard"
      className={styles.formControl}
    >
      <FormLabel
        component="legend"
        className={styles.formLabel}
      >
        {label}
      </FormLabel>
      <RadioGroup
        aria-label={label}
        value={valueSelected}
        onChange={onChangeGroup}
      >
        {dataSource.map((e, index) => {
          const valueToUse = e.value.toString ? e.value.toString() : e.value

          return (
            <FormControlLabel
              key={index}
              value={valueToUse}
              control={
                <Radio
                  data-id={`${name}_${valueToUse}`}
                  color="primary"
                  className={styles.radio}
                />
              }
              label={e.label}
              onClick={onClickButton}
            />
          )
        })}
      </RadioGroup>
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
      {!!helperText && (
        <FormHelperText id={`${label}HelperText`}>{helperText}</FormHelperText>
      )}
    </FormControl>
  )
}
