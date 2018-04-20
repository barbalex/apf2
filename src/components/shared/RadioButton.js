// @flow
import React from 'react'
import { observer } from 'mobx-react'
import Radio, { RadioGroup } from 'material-ui-next/Radio'
import { FormLabel, FormControl, FormControlLabel } from 'material-ui-next/Form'
import withHandlers from 'recompose/withHandlers'
import compose from 'recompose/compose'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  break-inside: avoid;
`
const StyledLabel = styled(FormLabel)`
  font-size: 12px !important;
  user-select: none;
`

const enhance = compose(
  withHandlers({
    onChange: props => event => {
      // if clicked element is active value: set null
      // Problem: does not work because change event does not happen
      // Solution: do this in click event of button
      props.updatePropertyInDb(props.tree, props.fieldName, event.target.value)
    },
    onClickButton: props => event => {
      const { value } = event.target
      // eslint-disable-next-line eqeqeq
      if (value == props.value) {
        // an already active tpopId was clicked
        // set value null
        props.updatePropertyInDb(props.tree, props.fieldName, null)
      }
    },
  }),
  observer
)

const MyRadioButton = ({
  fieldName,
  value,
  label,
  onChange,
  onClickButton,
}: {
  fieldName: string,
  value?: ?number | ?string,
  label: string,
  onChange: () => void,
  onClickButton: () => void,
}) => (
  <Container>
    <FormControl component="fieldset">
      <StyledLabel component="legend">{label}</StyledLabel>
      <RadioGroup
        aria-label={label}
        name={fieldName}
        value={!!value ? value.toString() : null}
        onChange={onChange}
      >
        <FormControlLabel
          value="1"
          control={<Radio onClick={onClickButton} color="primary" />}
        />
      </RadioGroup>
    </FormControl>
  </Container>
)

MyRadioButton.defaultProps = {
  value: '',
}

export default enhance(MyRadioButton)
