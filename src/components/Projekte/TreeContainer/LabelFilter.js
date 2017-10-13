// @flow

import React from 'react'
import { observer, inject } from 'mobx-react'
import TextField from 'material-ui/TextField'
import styled from 'styled-components'
import compose from 'recompose/compose'

import tables from '../../../modules/tables'

const FilterField = styled(TextField)`
  margin-top: -0.6em;
  padding: 0 0.8em 0 0.8em;
  div hr {
    width: calc(100% - 20px) !important;
  }
`

const enhance = compose(inject('store'), observer)

const LabelFilter = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree
  let filteredTable = ''

  if (activeDataset && activeDataset.folder) {
    filteredTable = activeDataset.folder
  } else if (activeDataset && activeDataset.table) {
    filteredTable = activeDataset.table
  }
  let labelText = 'filtern'
  let filterValue = ''
  if (filteredTable) {
    filterValue = tree.nodeLabelFilter.get(filteredTable) || ''
    const table = tables.find(
      (t: { label: string }) => t.table === filteredTable
    )
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
      onChange={(event, val) => tree.updateLabelFilter(filteredTable, val)}
    />
  )
}

export default enhance(LabelFilter)
