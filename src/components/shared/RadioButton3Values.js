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
    onChange: props => (event, valuePassed) => {
      const val = valuePassed === '' ? null : valuePassed
      props.updatePropertyInDb(props.tree, props.fieldName, val)
    },
  }),
  observer
)

const MyRadioButtonGroup = ({
  fieldName,
  value,
  label,
  onChange,
}: {
  fieldName: string,
  value?: number | string,
  label: string,
  onChange: () => void,
}) => {
  // react does not accept null values, need to use ''
  const valueSelected = value !== null && value !== undefined ? value : ''

  return (
    <Container>
      <StyledLabel>
        {label}
      </StyledLabel>
      <RadioButtonGroup
        name={fieldName}
        valueSelected={valueSelected}
        onChange={onChange}
      >
        <RadioButton key={1} value={''} label="kein Wert" />
        <RadioButton key={2} value={1} label="ja" />
        <RadioButton key={3} value={0} label="nein" />
      </RadioButtonGroup>
    </Container>
  )
}

MyRadioButtonGroup.defaultProps = {
  value: null,
}

export default enhance(MyRadioButtonGroup)
