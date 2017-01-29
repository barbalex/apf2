// @flow
import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withHandlers({
    onChange: props => (event, key, payload) =>
      props.updatePropertyInDb(props.fieldName, payload),
  }),
  observer
)

const MySelectField = ({
  label,
  value,
  dataSource,
  valueProp,
  labelProp,
  onChange,
}) =>
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

MySelectField.propTypes = {
  label: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.any,
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  valueProp: PropTypes.string.isRequired,
  labelProp: PropTypes.string.isRequired,
  updatePropertyInDb: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

MySelectField.defaultProps = {
  value: ``,
}

export default enhance(MySelectField)
