// @flow
import React, { PropTypes } from 'react'
import { inject } from 'mobx-react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import tables from '../../modules/tables'

const enhance = compose(
  inject(`store`),
  withHandlers({
    onClickAbort: props => () =>
      props.store.deleteDatasetAbort(),
    onClickDelete: props => () =>
      props.store.deleteDatasetExecute(),
  })
)

const DatasetDeleteModal = ({
  store,
  onClickAbort,
  onClickDelete,
}) => {
  const actions = [
    <FlatButton
      label="Abbrechen"
      onTouchTap={onClickAbort}
    />,
    <FlatButton
      label="Löschen"
      primary
      keyboardFocused
      onTouchTap={onClickDelete}
    />,
  ]
  const table = tables.find(t =>
    t.table === store.datasetToDelete.table
  )
  let tableName = null
  if (table && table.labelSingular) {
    tableName = table.labelSingular
  }

  return (
    <Dialog
      actions={actions}
      modal
      open={!!store.datasetToDelete.id}
    >
      {`${tableName ? `${tableName} "` : ``}${store.datasetToDelete.label}${tableName ? `"` : ``} löschen?`}
    </Dialog>
  )
}

DatasetDeleteModal.propTypes = {
  store: PropTypes.object.isRequired,
  onClickAbort: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
}

export default enhance(DatasetDeleteModal)
