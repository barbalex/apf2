// @flow
import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withHandlers({
    onChange: props => (event, valuePassed) => {
      // if clicked element is active value: set null
      const val = valuePassed === props.value ? null : valuePassed
      props.updatePropertyInDb(props.tree, props.fieldName, val)
    },
  }),
  observer
)

const MyRadioButtonGroup = ({
  fieldName,
  value,
  dataSource,
  onChange,
}) => {
  const valueSelected = (value !== null && value !== undefined) ? value : ``

  return (
    <RadioButtonGroup
      name={fieldName}
      valueSelected={valueSelected}
      onChange={onChange}
    >
      {
        dataSource.map((e, index) =>
          <RadioButton
            value={e.value}
            label={e.label}
            key={index}
          />
        )
      }
    </RadioButtonGroup>
  )
}

MyRadioButtonGroup.propTypes = {
  tree: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dataSource: PropTypes.arrayOf(PropTypes.object),
  updatePropertyInDb: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

MyRadioButtonGroup.defaultProps = {
  value: null,
  dataSource: [],
}

export default enhance(MyRadioButtonGroup)
