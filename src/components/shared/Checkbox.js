import React, { PropTypes } from 'react'
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
      updatePropertyInDb(fieldName, val)
    },
  }),
  observer
)

const MyCheckbox = ({
  value,
  label,
  onCheck,
}) =>
  <div>
    <Label label={label} />
    <Checkbox
      checked={value === 1}
      onCheck={onCheck}
    />
  </div>

MyCheckbox.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.number,
  label: PropTypes.string.isRequired,
  updatePropertyInDb: PropTypes.func.isRequired,
  onCheck: PropTypes.func.isRequired,
}

MyCheckbox.defaultProps = {
  value: null,
}

export default enhance(MyCheckbox)
