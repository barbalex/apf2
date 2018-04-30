// @flow
import React from 'react'
import Radio, { RadioGroup } from 'material-ui/Radio'
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

// without slight padding radio is slightly cut off!
const StyledFormControl = styled(FormControl)`
  padding-left: 1px !important;
  padding-bottom: 12px !important;
  break-inside: avoid;
`
const StyledFormLabel = styled(FormLabel)`
  padding-top: 10px !important;
  font-size: 12px !important;
  cursor: text;
  user-select: none;
  pointer-events: none;
  padding-bottom: 8px !important;
`
const StyledRadio = styled(Radio)`
  height: 26px !important;
  max-height: 26px !important;
`

const enhance = compose(
  withHandlers({
    onClickButton: ({ value, saveToDb }) => event => {
      // if clicked element is active value: set null
      // Problem: does not work on change event on RadioGroup
      // Solution: do this in click event of button
      const newValue = event.target.value === 'true'
      if (newValue === value) {
        // an already active option was clicked
        // set value null
        return saveToDb(null)
      }
      saveToDb(newValue)
    },
  })
)

const RadioButtonGroup = ({
  value,
  label,
  dataSource = [],
  onClickButton,
}: {
  value: Number | String,
  label: String,
  dataSource: Array<Object>,
  onClickButton: () => void,
}) => {
  const valueSelected =
    value !== null && value !== undefined ? value.toString() : ''

  return (
    <StyledFormControl component="fieldset">
      <StyledFormLabel component="legend">{label}</StyledFormLabel>
      <RadioGroup aria-label={label} value={valueSelected}>
        {dataSource.map((e, index) => (
          <FormControlLabel
            key={index}
            value={e.value.toString()}
            control={<StyledRadio color="primary" />}
            label={e.label}
            onClick={onClickButton}
          />
        ))}
      </RadioGroup>
    </StyledFormControl>
  )
}

RadioButtonGroup.defaultProps = {
  value: null,
}

export default enhance(RadioButtonGroup)
