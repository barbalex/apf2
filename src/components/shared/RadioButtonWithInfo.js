// @flow
import React from 'react'
import { observer } from 'mobx-react'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import InfoWithPopover from './InfoWithPopover'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: -5px;
  break-inside: avoid;
`
const RadioButtonGroupContainer = styled.div`
  display: flex;
  justify-content: space-between;
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
      // if clicked element is active value: set 0
      const val = valuePassed === props.value ? 0 : valuePassed
      props.updatePropertyInDb(props.tree, props.fieldName, val)
    },
  }),
  observer
)

const RadioButtonWithInfo = ({
  fieldName,
  value,
  label,
  popover,
  onChange,
  updatePropertyInDb,
}: {
  fieldName: string,
  value?: ?number | ?string,
  label: string,
  popover: Object,
  onChange: () => void,
  updatePropertyInDb: () => void,
}) =>
  <Container>
    <StyledLabel>
      {label}
    </StyledLabel>
    <RadioButtonGroupContainer>
      <RadioButtonGroup
        name={fieldName}
        valueSelected={value}
        onChange={onChange}
      >
        <RadioButton value={1} />
      </RadioButtonGroup>
      <InfoWithPopover>
        {popover}
      </InfoWithPopover>
    </RadioButtonGroupContainer>
  </Container>

RadioButtonWithInfo.defaultProps = {
  value: '',
}

export default enhance(RadioButtonWithInfo)
