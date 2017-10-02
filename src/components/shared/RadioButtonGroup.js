// @flow
import React from 'react'
import { observer } from 'mobx-react'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

const Container = styled.div`
  margin-top: 5px;
  flex-grow: 1;
  break-inside: avoid;
`
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

const MyRadioButtonGroup = ({
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
  const valueSelected = value !== null && value !== undefined ? value : ''

  return (
    <Container>
      <StyledLabel>{label}</StyledLabel>
      <RadioButtonGroup
        name={fieldName}
        valueSelected={valueSelected}
        onChange={onChange}
      >
        {dataSource.map((e, index) => (
          <RadioButton
            value={e.value}
            label={e.label}
            key={index}
            onClick={onClickButton}
          />
        ))}
      </RadioButtonGroup>
    </Container>
  )
}

MyRadioButtonGroup.defaultProps = {
  value: null,
}

export default enhance(MyRadioButtonGroup)
