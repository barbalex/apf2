// @flow
import React from 'react'
import { observer } from 'mobx-react'
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
    onChange: ({ updatePropertyInDb, tree, fieldName }) => event => {
      // if clicked element is active value: set null
      // Problem: does not work because change event does not happen
      // Solution: do this in click event of button
      updatePropertyInDb(tree, fieldName, event.target.value)
    },
    onClickButton: ({
      value,
      updatePropertyInDb,
      tree,
      fieldName,
    }) => event => {
      const valueClicked =
        event.target.value && !isNaN(event.target.value)
          ? +event.target.value
          : event.target.value
      // eslint-disable-next-line eqeqeq
      if (valueClicked == value) {
        // an already active tpopId was clicked
        // set value null
        updatePropertyInDb(tree, fieldName, null)
      }
    },
  }),
  observer
)

const RadioButtonGroup = ({
  fieldName,
  value,
  label,
  dataSource = [],
  onChange,
  onClickButton,
}: {
  fieldName: string,
  value?: number | string,
  label: string,
  dataSource?: Array<Object>,
  onChange: () => void,
  onClickButton: () => void,
}) => {
  const valueSelected =
    value !== null && value !== undefined ? value.toString() : ''

  return (
    <StyledFormControl component="fieldset">
      <StyledFormLabel component="legend">{label}</StyledFormLabel>
      <RadioGroup
        aria-label={fieldName}
        name={fieldName}
        value={valueSelected}
        onChange={onChange}
      >
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
