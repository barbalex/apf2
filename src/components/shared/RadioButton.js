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
`
const StyledRadioButtonGroup = styled(RadioButtonGroup)`
  margin-bottom: 0;
`
const StyledLabel = styled.div`
  margin-top: 10px;
  cursor: text;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.498039);
  pointer-events: none;
  user-select: none;
  padding-bottom: 8px;
`

const enhance = compose(
  withHandlers({
    onChange: props => (event, valuePassed) => {
      // if clicked element is active value: set 0
      const val = valuePassed === props.value ? 0 : valuePassed
      props.updatePropertyInDb(props.tree, props.fieldName, val)
    },
  }),
  observer,
)

const MyRadioButton = ({
  fieldName,
  value,
  label,
  onChange,
}: {
  fieldName: string,
  value?: ?number | ?string,
  label: string,
  onChange: () => void,
}) => (
  <Container>
    <StyledLabel>
      {label}
    </StyledLabel>
    <StyledRadioButtonGroup
      name={fieldName}
      valueSelected={value}
      onChange={onChange}
    >
      <RadioButton value={1} />
    </StyledRadioButtonGroup>
  </Container>
)

MyRadioButton.defaultProps = {
  value: '',
}

export default enhance(MyRadioButton)
