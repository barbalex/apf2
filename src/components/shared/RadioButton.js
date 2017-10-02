// @flow
import React from 'react'
import { observer } from 'mobx-react'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import withHandlers from 'recompose/withHandlers'
import compose from 'recompose/compose'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  break-inside: avoid;
`
const StyledRadioButtonGroup = styled(RadioButtonGroup)`margin-bottom: 0;`
const StyledLabel = styled.div`
  margin-top: 10px;
  cursor: text;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  user-select: none;
  padding-bottom: 8px;
`

const enhance = compose(
  withHandlers({
    onChange: props => (event, val) => {
      // if clicked element is active value: set null
      // Problem: does not work because change event does not happen
      // Solution: do this in click event of button
      props.updatePropertyInDb(props.tree, props.fieldName, val)
    },
    onClickButton: props => event => {
      const valueClicked =
        event.target.value && !isNaN(event.target.value)
          ? +event.target.value
          : event.target.value
      if (valueClicked === props.value) {
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
    <StyledLabel>{label}</StyledLabel>
    <StyledRadioButtonGroup
      name={fieldName}
      valueSelected={value}
      onChange={onChange}
    >
      <RadioButton value={1} onClick={onClickButton} />
    </StyledRadioButtonGroup>
  </Container>
)

MyRadioButton.defaultProps = {
  value: '',
}

export default enhance(MyRadioButton)
