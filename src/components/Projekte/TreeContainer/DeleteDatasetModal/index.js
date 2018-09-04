// @flow
import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import compose from 'recompose/compose'

import tables from '../../../../modules/tables'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import deleteDataset from './delete'
import withDeleteState from '../../../../state/withDeleteState'
import withErrorState from '../../../../state/withErrorState'

const StyledDialog = styled(Dialog)`
  > div {
    padding: 24px 24px 0 24px;
  }
`

const enhance = compose(
  withDeleteState,
  withErrorState,
)

const DatasetDeleteModal = ({
  deleteState,
  errorState,
}: {
  deleteState: Object,
  errorState: Object,
}) => (
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) {
        if (
          error.message.includes('permission denied') ||
          error.message.includes('keine Berechtigung')
        ) {
          // ProjektContainer returns helpful screen
          return null
        }
        return `Fehler: ${error.message}`
      }
      const datasetToDelete = deleteState.state.toDelete
      const table = tables.find(t => t.table === datasetToDelete.table)
      let tableName = null
      if (table && table.labelSingular) {
        tableName = table.labelSingular
      }
      let question = `${tableName ? `${tableName} "` : ''}${
        datasetToDelete.label
      }${tableName ? '"' : ''} löschen?`
      if (!datasetToDelete.label) {
        question = `${tableName} löschen?`
      }

      return (
        <ErrorBoundary>
          <StyledDialog open={!!datasetToDelete.table}>
            {question}
            <DialogActions>
              <Button onClick={() => deleteState.emptyToDelete()}>
                Abbrechen
              </Button>
              <Button
                color="primary"
                onClick={() =>
                  deleteDataset({
                    dataPassedIn: data,
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
    }}
  </Query>
)

export default enhance(DatasetDeleteModal)
