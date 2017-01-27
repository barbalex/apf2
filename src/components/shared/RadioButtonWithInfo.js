import React, { PropTypes } from 'react'
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
      props.updatePropertyInDb(props.fieldName, val)
    },
  }),
  observer
)

const MyRadioButton = ({
  fieldName,
  value,
  popover,
  onChange,
}) =>
  <Container>
    <RadioButtonGroup
      name={fieldName}
      valueSelected={value}
      onChange={onChange}
    >
      <RadioButton
        value={1}
      />
    </RadioButtonGroup>
    <InfoWithPopover>
      {popover}
    </InfoWithPopover>
  </Container>

MyRadioButton.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  updatePropertyInDb: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  popover: PropTypes.element.isRequired,
}

MyRadioButton.defaultProps = {
  value: ``,
}

export default enhance(MyRadioButton)
