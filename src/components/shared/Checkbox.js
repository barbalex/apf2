// @flow
import React from 'react'
import { observer } from 'mobx-react'
import { Checkbox } from 'material-ui/Checkbox'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import Label from './Label'

const enhance = compose(
  withHandlers({
    onCheck: props => (e, isInputChecked) => {
      const { updatePropertyInDb, fieldName } = props
      const val = isInputChecked ? 1 : null
      updatePropertyInDb(props.tree, fieldName, val)
    },
  }),
  observer
)

const MyCheckbox = ({
  value,
  label,
  onCheck,
}: {
  value?: number | string,
  label: string,
  onCheck: () => void,
}) => (
  <div>
    <Label label={label} />
    <Checkbox checked={value === 1} onCheck={onCheck} />
  </div>
)

MyCheckbox.defaultProps = {
  value: null,
}

export default enhance(MyCheckbox)
