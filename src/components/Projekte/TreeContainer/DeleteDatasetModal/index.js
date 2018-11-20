// @flow
import React, { useContext, useCallback } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'
import { withApollo } from 'react-apollo'

import tables from '../../../../modules/tables'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withLocalData from './withLocalData'
import deleteDataset from './delete'
import mobxStoreContext from '../../../../mobxStoreContext'

const StyledDialog = styled(Dialog)`
  > div > div {
    padding: 24px 24px 0 24px;
  }
`

const enhance = compose(
  withApollo,
  withLocalData,
  observer,
)

const DatasetDeleteModal = ({
  localData,
  client,
}: {
  localData: Object,
  client: Object,
}) => {
  if (localData.error) {
    if (
      localData.error.message.includes('permission denied') ||
      localData.error.message.includes('keine Berechtigung')
    ) {
      // ProjektContainer returns helpful screen
      return null
    }
    return `Fehler: ${localData.error.message}`
  }

  const { addError, toDelete, emptyToDelete, addDeletedDataset } = useContext(
    mobxStoreContext,
  )

  const datasetToDelete = toDelete
  const table = tables.find(t => t.table === datasetToDelete.table)
  let tableName = null
  if (table && table.labelSingular) {
    tableName = table.labelSingular
  }
  let question = `${tableName ? `${tableName} "` : ''}${datasetToDelete.label}${
    tableName ? '"' : ''
  } löschen?`
  if (!datasetToDelete.label) {
    question = `${tableName} löschen?`
  }

  const onClickAbbrechen = useCallback(() => emptyToDelete())
  const onClickLoeschen = useCallback(
    () =>
      deleteDataset({
        dataPassedIn: localData,
        toDelete,
        emptyToDelete,
        addDeletedDataset,
        addError,
        client,
      }),
    [localData],
  )

  return (
    <ErrorBoundary>
      <StyledDialog open={!!datasetToDelete.table}>
        {question}
        <DialogActions>
          <Button onClick={onClickAbbrechen}>Abbrechen</Button>
          <Button color="primary" onClick={onClickLoeschen}>
            Löschen
          </Button>
          ,
        </DialogActions>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default enhance(DatasetDeleteModal)
