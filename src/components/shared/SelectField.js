// @flow
import React from 'react'
import { observer } from 'mobx-react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withHandlers({
    onChange: props => (event, key, payload) =>
      props.updatePropertyInDb(props.tree, props.fieldName, payload),
  }),
  observer
)

const MySelectField = (
  {
    label,
    value,
    dataSource,
    valueProp,
    labelProp,
    onChange,
  }:
  {
    label: string,
    value?: ?number|?string,
    dataSource: Array<Object>,
    valueProp: string,
    labelProp: string,
    onChange: () => void,
  }
) =>
  <SelectField
    floatingLabelText={label}
    value={value}
    fullWidth
    onChange={onChange}
  >
    {
      dataSource.map((e, index) =>
        <MenuItem
          value={e[valueProp]}
          primaryText={e[labelProp]}
          key={index}
        />
      )
    }
  </SelectField>

MySelectField.defaultProps = {
  value: ``,
}

export default enhance(MySelectField)
