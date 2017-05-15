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
  justify-content: space-between;
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

const RadioButtonWithInfo = ({
  fieldName,
  value,
  popover,
  onChange,
}: {
  fieldName: string,
  value?: ?number | ?string,
  popover: Object,
  onChange: () => void,
}) => (
  <Container>
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
  </Container>
)

RadioButtonWithInfo.defaultProps = {
  value: '',
}

export default enhance(RadioButtonWithInfo)
