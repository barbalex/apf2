// @flow

import React from 'react'
import { observer, inject } from 'mobx-react'
import Input, { InputLabel } from 'material-ui-next/Input'
import { FormControl } from 'material-ui-next/Form'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import tables from '../../../modules/tables'

const StyledFormControl = styled(FormControl)`
  padding-right: 0.8em !important;
`
const StyledInput = styled(Input)`
  div hr {
    width: calc(100% - 20px) !important;
  }
  &:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onChange: ({ store, tree }: { store: Object, tree: Object }) => event => {
      const { activeDataset } = tree
      let filteredTable = ''

      if (activeDataset && activeDataset.folder) {
        filteredTable = activeDataset.folder
      } else if (activeDataset && activeDataset.table) {
        filteredTable = activeDataset.table
      }
      tree.updateLabelFilter(filteredTable, event.target.value)
    },
  }),
  observer
)

const LabelFilter = ({
  store,
  tree,
  onChange,
}: {
  store: Object,
  tree: Object,
  onChange: () => void,
}) => {
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
    <StyledFormControl fullWidth>
      <InputLabel htmlFor={labelText}>{labelText}</InputLabel>
      <StyledInput id={labelText} value={filterValue} onChange={onChange} />
    </StyledFormControl>
  )
}

export default enhance(LabelFilter)
