/* eslint-disable no-console, jsx-a11y/no-static-element-interactions */

import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import TextField from 'material-ui/TextField'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import tables from '../../../modules/tables'

const FilterField = styled(TextField)`
  margin-top: -0.6em;
  padding: 0 0.8em 0 0.8em;
`

const enhance = compose(
  inject(`store`),
  withHandlers({
    onChange: props => (event, val) =>
      props.store.updateLabelFilter(props.filteredTable, val)
    ,
  }),
  observer
)

const LabelFilter = ({
  store,
  onChange,
}) => {
  const { node } = store
  const { activeDataset } = store
  let filteredTable = ``
  if (activeDataset && activeDataset.folder) {
    filteredTable = activeDataset.folder
  } else if (activeDataset && activeDataset.table) {
    filteredTable = activeDataset.table
  }
  let labelText = `filtern`
  let filterValue = ``
  if (filteredTable) {
    filterValue = node.nodeLabelFilter.get(filteredTable) || ``
    const table = tables.find(t => t.table === filteredTable)
    const tableLabel = table ? table.label : null
    if (tableLabel) {
      labelText = `${tableLabel} filtern`
    }
  }

  return (
    <FilterField
      floatingLabelText={labelText}
      fullWidth
      value={filterValue}
      onChange={onChange}
    />
  )
}

LabelFilter.propTypes = {
  store: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default enhance(LabelFilter)
