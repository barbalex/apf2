// @flow
/* eslint-disable no-console, jsx-a11y/no-static-element-interactions */

import React, { PropTypes } from 'react'
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

const enhance = compose(
  inject(`store`),
  observer
)

const LabelFilter = ({ store, tree }) => {
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
    filterValue = tree.nodeLabelFilter.get(filteredTable) || ``
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
      onChange={(event, val) =>
        tree.updateLabelFilter(filteredTable, val)
      }
    />
  )
}

LabelFilter.propTypes = {
  store: PropTypes.object.isRequired,
  tree: PropTypes.object.isRequired,
}

export default enhance(LabelFilter)
