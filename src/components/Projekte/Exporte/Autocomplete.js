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
      props.changeArtFuerEierlegendeWollmilchsau(val.Artname)
      props.downloadFromView({
        view: 'v_tpop_anzkontrinklletzterundletztertpopber',
        fileName: 'anzkontrinklletzterundletztertpopber_2016',
        apArtId: val.TaxonomieId,
      })
    },
    onFocus: props => () => props.changeFocused(true),
    onBlur: props => () => {
      const { changeFocused } = props
      changeFocused(false)
    },
    onUpdateSearchText: props => searchText => {
      props.changeSearchText(searchText)
    },
  }),
  observer
)

const MyAutocomplete = ({
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
  downloadFromView,
  changeArtFuerEierlegendeWollmilchsau,
}: {
  dataSource: Array<Object>,
  dataSourceConfig: Object,
  onNewRequest: () => void,
  focused: boolean,
  changeFocused: () => void,
  onFocus: () => void,
  onBlur: () => void,
  searchText: ?string,
  changeSearchText: () => void,
  onUpdateSearchText: () => void,
  downloadFromView: () => void,
  changeArtFuerEierlegendeWollmilchsau: () => void,
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
  const labelFilterHint = 'Zum Filtern tippen. '
  let labelNumberLimit = ''
  if (searchText && dataSourceLength === 0) {
    labelNumberLimit = 'Kein Eintrag entspricht dem Filter.'
  } else if (dataSourceLength && dataSourceLength <= 20) {
    labelNumberLimit = `Alle Einträge angezeigt.`
  } else if (dataSourceLength > 20) {
    labelNumberLimit = 'Erste 20 Einträge angezeigt.'
  }
  const labelText = focused
    ? `Wollmilchsau${labelFilterHint || labelNumberLimit
        ? '. '
        : ''}${labelFilterHint}${labelNumberLimit}`
    : '"Eier legende Wollmilchsau" für eine Art'

  return (
    <StyledAutoComplete
      hintText={dataSource.length === 0 ? 'lade Daten...' : 'Art wählen'}
      fullWidth
      floatingLabelText={labelText}
      dataSource={dataSource}
      dataSourceConfig={dataSourceConfig}
      searchText={searchText}
      onUpdateInput={onUpdateSearchText}
      filter={AutoComplete.caseInsensitiveFilter}
      maxSearchResults={20}
      onNewRequest={onNewRequest}
      openOnFocus
      onFocus={onFocus}
      onBlur={onBlur}
      menuStyle={{
        maxHeight: '500px',
        fontSize: '6px !important',
      }}
    />
  )
}

export default enhance(MyAutocomplete)
