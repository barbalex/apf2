// @flow
import React from 'react'
import { inject } from 'mobx-react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import tables from '../../../modules/tables'

const enhance = compose(
  inject('store'),
  withHandlers({
    onClickAbort: props => () => props.store.deleteDatasetAbort(),
    onClickDelete: props => () => props.store.deleteDatasetExecute(props.tree),
  }),
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
    <FlatButton label="Abbrechen" onClick={onClickAbort} />,
    <FlatButton
      label="Löschen"
      primary
      keyboardFocused
      onClick={onClickDelete}
    />,
  ]
  const table = tables.find(t => t.table === store.datasetToDelete.table)
  let tableName = null
  if (table && table.labelSingular) {
    tableName = table.labelSingular
  }

  return (
    <Dialog actions={actions} modal open={!!store.datasetToDelete.id}>
      {`${tableName ? `${tableName} "` : ''}${store.datasetToDelete.label}${tableName ? '"' : ''} löschen?`}
    </Dialog>
  )
}

export default enhance(DatasetDeleteModal)
