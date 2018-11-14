// @flow
import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import compose from 'recompose/compose'

import tables from '../../../../modules/tables'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withLocalData from './withLocalData'
import deleteDataset from './delete'
import withDeleteState from '../../../../state/withDeleteState'
import withErrorState from '../../../../state/withErrorState'

const StyledDialog = styled(Dialog)`
  > div > div {
    padding: 24px 24px 0 24px;
  }
`

const enhance = compose(
  withLocalData,
  withDeleteState,
  withErrorState,
)

const DatasetDeleteModal = ({
  deleteState,
  errorState,
  localData,
}: {
  deleteState: Object,
  errorState: Object,
  localData: Object,
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
  const datasetToDelete = deleteState.state.toDelete
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

  return (
    <ErrorBoundary>
      <StyledDialog open={!!datasetToDelete.table}>
        {question}
        <DialogActions>
          <Button onClick={() => deleteState.emptyToDelete()}>Abbrechen</Button>
          <Button
            color="primary"
            onClick={() =>
              deleteDataset({
                dataPassedIn: localData,
                deleteState,
                errorState,
              })
            }
          >
            Löschen
          </Button>
          ,
        </DialogActions>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default enhance(DatasetDeleteModal)
