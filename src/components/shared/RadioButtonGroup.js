// @flow
import React from 'react'
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
  observer,
)

const MyRadioButtonGroup = ({
  fieldName,
  value,
  dataSource = [],
  onChange,
}: {
  fieldName: string,
  value?: number | string,
  dataSource?: Array<Object>,
  onChange: () => void,
}) => {
  const valueSelected = value !== null && value !== undefined ? value : ''

  return (
    <RadioButtonGroup
      name={fieldName}
      valueSelected={valueSelected}
      onChange={onChange}
    >
      {dataSource.map((e, index) => (
        <RadioButton value={e.value} label={e.label} key={index} />
      ))}
    </RadioButtonGroup>
  )
}

MyRadioButtonGroup.defaultProps = {
  value: null,
}

export default enhance(MyRadioButtonGroup)
