// @flow
import React from 'react'
import { observer } from 'mobx-react'
import AutoComplete from 'material-ui/AutoComplete'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withHandlers({
    onNewRequest: props => val => {
      const { updatePropertyInDb, fieldName, dataSourceConfig } = props
      updatePropertyInDb(props.tree, fieldName, val[dataSourceConfig.value])
    },
  }),
  observer,
)

const MyAutocomplete = ({
  label,
  valueText = '',
  dataSource,
  dataSourceConfig = {
    value: 'id',
    text: 'label',
  },
  onNewRequest,
}: {
  tree: Object,
  label: string,
  fieldName: string,
  valueText?: string,
  dataSource: Array<Object>,
  dataSourceConfig: Object,
  updatePropertyInDb: () => void,
  onNewRequest: () => void,
}) => (
  <AutoComplete
    hintText={dataSource.length === 0 ? 'lade Daten...' : ''}
    fullWidth
    floatingLabelText={label}
    dataSource={dataSource}
    dataSourceConfig={dataSourceConfig}
    searchText={valueText}
    filter={AutoComplete.caseInsensitiveFilter}
    maxSearchResults={20}
    onNewRequest={onNewRequest}
  />
)

export default enhance(MyAutocomplete)
