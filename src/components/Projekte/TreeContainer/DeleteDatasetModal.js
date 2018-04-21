// @flow
import React from 'react'
import { inject } from 'mobx-react'
import Dialog from 'material-ui/Dialog'
import Button from 'material-ui-next/Button'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import tables from '../../../modules/tables'
import ErrorBoundary from '../../shared/ErrorBoundary'

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
  const actions = [
    <Button onClick={onClickAbort}>Abbrechen</Button>,
    <Button color="primary" onClick={onClickDelete}>
      Löschen
    </Button>,
  ]
  const table = tables.find(t => t.table === store.datasetToDelete.table)
  let tableName = null
  if (table && table.labelSingular) {
    tableName = table.labelSingular
  }

  return (
    <ErrorBoundary>
      <Dialog actions={actions} modal open={!!store.datasetToDelete.id}>
        {`${tableName ? `${tableName} "` : ''}${store.datasetToDelete.label}${
          tableName ? '"' : ''
        } löschen?`}
      </Dialog>
    </ErrorBoundary>
  )
}

export default enhance(DatasetDeleteModal)
