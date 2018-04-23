// @flow
import React from 'react'
import { inject } from 'mobx-react'
import Dialog, { DialogActions } from 'material-ui-next/Dialog'
import Button from 'material-ui-next/Button'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import tables from '../../../modules/tables'
import ErrorBoundary from '../../shared/ErrorBoundary'

const StyledDialog = styled(Dialog)`
  > div {
    padding: 24px 24px 0 24px;
  }
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onClickAbort: props => () => props.store.deleteDatasetAbort(),
    onClickDelete: props => () => props.store.deleteDatasetExecute(props.tree),
  })
)

const DatasetDeleteModal = ({
  store,
  onClickAbort,
  onClickDelete,
}: {
  store: Object,
  onClickAbort: () => void,
  onClickDelete: () => void,
}) => {
  const table = tables.find(t => t.table === store.datasetToDelete.table)
  let tableName = null
  if (table && table.labelSingular) {
    tableName = table.labelSingular
  }

  return (
    <ErrorBoundary>
      <StyledDialog open={!!store.datasetToDelete.id}>
        {`${tableName ? `${tableName} "` : ''}${store.datasetToDelete.label}${
          tableName ? '"' : ''
        } löschen?`}
        <DialogActions>
          <Button onClick={onClickAbort}>Abbrechen</Button>
          <Button color="primary" onClick={onClickDelete}>
            Löschen
          </Button>,
        </DialogActions>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default enhance(DatasetDeleteModal)
