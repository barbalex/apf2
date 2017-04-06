// @flow
import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import AutoComplete from 'material-ui/AutoComplete'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withHandlers({
    onNewRequest: props => (val) => {
      const { updatePropertyInDb, fieldName, dataSourceConfig } = props
      updatePropertyInDb(props.tree, fieldName, val[dataSourceConfig.value])
    },
  }),
  observer
)

const MyAutocomplete = ({
  label,
  valueText,
  dataSource,
  dataSourceConfig = {
    value: `id`,
    text: `label`,
  },
  onNewRequest,
}) =>
  <AutoComplete
    hintText={dataSource.length === 0 ? `lade Daten...` : ``}
    fullWidth
    floatingLabelText={label}
    openOnFocus
    dataSource={dataSource}
    dataSourceConfig={dataSourceConfig}
    searchText={valueText}
    filter={AutoComplete.caseInsensitiveFilter}
    maxSearchResults={20}
    onNewRequest={onNewRequest}
  />

MyAutocomplete.propTypes = {
  tree: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  valueText: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataSourceConfig: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    text: PropTypes.string,
  }).isRequired,
  updatePropertyInDb: PropTypes.func.isRequired,
  onNewRequest: PropTypes.func.isRequired,
}

MyAutocomplete.defaultProps = {
  valueText: ``,
}

export default enhance(MyAutocomplete)
