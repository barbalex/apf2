// @flow
import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import RadioButtonGroup from './RadioButtonGroup'
import InfoWithPopover from './InfoWithPopover'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
`
const RadioButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ButtonGroup = styled.div`
  flex-grow: 1;
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

const RadioButtonGroupWithInfo = ({
  tree,
  fieldName,
  value,
  dataSource,
  updatePropertyInDb,
  popover,
  label,
}: {
  tree: Object,
  fieldName: string,
  value?: ?number | ?string,
  dataSource: Array<Object>,
  updatePropertyInDb: () => void,
  popover: Object,
  label: string,
}) => (
  <Container>
    <StyledLabel>
      {label}
    </StyledLabel>
    <RadioButtonContainer>
      <ButtonGroup>
        <RadioButtonGroup
          tree={tree}
          fieldName={fieldName}
          value={value}
          dataSource={dataSource}
          updatePropertyInDb={updatePropertyInDb}
        />
      </ButtonGroup>
      <InfoWithPopover>
        {popover}
      </InfoWithPopover>
    </RadioButtonContainer>
  </Container>
)

RadioButtonGroupWithInfo.defaultProps = {
  value: '',
}

export default observer(RadioButtonGroupWithInfo)
