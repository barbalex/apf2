// @flow
import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import RadioButtonGroup from './RadioButtonGroup'
import InfoWithPopover from './InfoWithPopover'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ButtonGroup = styled.div`
  flex-grow: 1;
`

const RadioButtonGroupWithInfo = ({
  fieldName,
  value,
  dataSource,
  updatePropertyInDb,
  popover,
}) =>
  <Container>
    <ButtonGroup>
      <RadioButtonGroup
        fieldName={fieldName}
        value={value}
        dataSource={dataSource}
        updatePropertyInDb={updatePropertyInDb}
      />
    </ButtonGroup>
    <InfoWithPopover>
      {popover}
    </InfoWithPopover>
  </Container>

RadioButtonGroupWithInfo.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  updatePropertyInDb: PropTypes.func.isRequired,
  popover: PropTypes.element.isRequired,
}

RadioButtonGroupWithInfo.defaultProps = {
  value: ``,
}

export default observer(RadioButtonGroupWithInfo)
