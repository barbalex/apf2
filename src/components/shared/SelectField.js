// @flow
import React from 'react'
import { observer } from 'mobx-react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

const StyledSelectField = styled(SelectField)`
  margin-bottom: ${props => `${props['data-marginBottom']}px` || '-15px'};
`

const enhance = compose(
  withHandlers({
    onChange: props => (event, key, payload) =>
      props.updatePropertyInDb(props.tree, props.fieldName, payload),
  }),
  observer
)

/**
 * marginBottom: needed because list overly disappears under the form bottom
 * when select field is last in form
 */
const MySelectField = ({
  label,
  value,
  dataSource,
  valueProp,
  labelProp,
  marginBottom,
  onChange,
}: {
  label: string,
  value?: ?number | ?string,
  dataSource: Array<Object>,
  valueProp: string,
  labelProp: string,
  marginBottom?: ?number,
  onChange: () => void,
}) =>
  <StyledSelectField
    floatingLabelText={label}
    value={value}
    fullWidth
    onChange={onChange}
    data-marginBottom={marginBottom}
  >
    {dataSource.map((e, index) =>
      <MenuItem value={e[valueProp]} primaryText={e[labelProp]} key={index} />
    )}
  </StyledSelectField>

MySelectField.defaultProps = {
  value: '',
}

export default enhance(MySelectField)
