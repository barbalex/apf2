// @flow
import React from 'react'
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
  tree,
  fieldName,
  value,
  dataSource,
  updatePropertyInDb,
  popover,
}: {
  tree: Object,
  fieldName: string,
  value?: ?number | ?string,
  dataSource: Array<Object>,
  updatePropertyInDb: () => void,
  popover: Object,
}) => (
  <Container>
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
  </Container>
)

RadioButtonGroupWithInfo.defaultProps = {
  value: '',
}

export default observer(RadioButtonGroupWithInfo)
