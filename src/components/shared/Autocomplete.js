// @flow
import React from 'react'
import { observer } from 'mobx-react'
import AutoComplete from 'material-ui/AutoComplete'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import styled from 'styled-components'

const StyledAutoComplete = styled(AutoComplete)`margin-bottom: -12px;`

const enhance = compose(
  withState('focused', 'changeFocused', false),
  withState('searchText', 'changeSearchText', ''),
  withHandlers({
    onNewRequest: props => val => {
      const { updatePropertyInDb, fieldName, dataSourceConfig } = props
      updatePropertyInDb(props.tree, fieldName, val[dataSourceConfig.value])
    },
    onFocus: props => () => props.changeFocused(true),
    onBlur: props => () => props.changeFocused(false),
    onUpdateSearchText: props => searchText =>
      props.changeSearchText(searchText),
  }),
  observer
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
  focused,
  changeFocused,
  onFocus,
  onBlur,
  searchText,
  changeSearchText,
  onUpdateSearchText,
}: {
  tree: Object,
  label: string,
  fieldName: string,
  valueText?: string,
  dataSource: Array<Object>,
  dataSourceConfig: Object,
  updatePropertyInDb: () => void,
  onNewRequest: () => void,
  focused: boolean,
  changeFocused: () => void,
  onFocus: () => void,
  onBlur: () => void,
  searchText: ?string,
  changeSearchText: () => void,
  onUpdateSearchText: () => void,
}) => {
  const dataSourceLength = dataSource.filter(d => {
    if (
      dataSourceConfig &&
      dataSourceConfig.text &&
      d[dataSourceConfig.text] &&
      d[dataSourceConfig.text].toLowerCase() &&
      searchText &&
      searchText.toLowerCase()
    ) {
      return d[dataSourceConfig.text]
        .toLowerCase()
        .includes(searchText.toLowerCase())
    }
    return true
  }).length
  const labelFilterHint =
    searchText && searchText.length ? '' : 'Zum Filtern tippen. '
  const labelNumberLimit =
    dataSourceLength > 200
      ? 'Nur die ersten 200 Einträge werden angezeigt.'
      : ''
  console.log('dataSourceLength:', dataSourceLength)
  const labelText = focused
    ? `${label}${labelFilterHint || labelNumberLimit
        ? '. '
        : ''}${labelFilterHint}${labelNumberLimit}`
    : label

  return (
    <StyledAutoComplete
      hintText={dataSource.length === 0 ? 'lade Daten...' : ''}
      fullWidth
      floatingLabelText={labelText}
      dataSource={dataSource}
      dataSourceConfig={dataSourceConfig}
      searchText={searchText || valueText}
      onUpdateInput={onUpdateSearchText}
      filter={AutoComplete.caseInsensitiveFilter}
      maxSearchResults={200}
      onNewRequest={onNewRequest}
      openOnFocus
      onFocus={onFocus}
      onBlur={onBlur}
      menuStyle={{
        maxHeight: `${window.innerHeight * 0.8}px`,
      }}
    />
  )
}

export default enhance(MyAutocomplete)
