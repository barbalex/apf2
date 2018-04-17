// @flow
import React from 'react'
import { observer } from 'mobx-react'
import Checkbox from 'material-ui/Checkbox'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import InfoWithPopover from './InfoWithPopover'
import Label from './Label'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
`

const enhance = compose(
  withHandlers({
    onCheck: props => (e, val) => {
      const { updatePropertyInDb, fieldName } = props
      updatePropertyInDb(props.tree, fieldName, val)
    },
  }),
  observer
)

const CheckboxWithInfo = ({
  fieldName,
  value,
  label,
  onCheck,
  popover,
  updatePropertyInDb,
}: {
  fieldName: string,
  value?: number | string,
  label: string,
  onCheck: () => void,
  popover: Object,
  updatePropertyInDb: () => void,
}) => (
  <Container>
    <div>
      <Label label={label} />
      <Checkbox checked={value} onCheck={onCheck} />
    </div>
    <InfoWithPopover>{popover}</InfoWithPopover>
  </Container>
)

CheckboxWithInfo.defaultProps = {
  value: null,
}

export default enhance(CheckboxWithInfo)
