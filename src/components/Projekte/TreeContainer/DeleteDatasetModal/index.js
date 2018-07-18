// @flow
import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import { Subscribe } from 'unstated'

import tables from '../../../../modules/tables'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import deleteDataset from './delete'
import DeleteState from '../../../../state/Delete'
import ErrorState from '../../../../state/Error'

const StyledDialog = styled(Dialog)`
  > div {
    padding: 24px 24px 0 24px;
  }
`

const DatasetDeleteModal = ({ refetchTree }: { refetchTree: () => void }) => (
  <Subscribe to={[DeleteState]}>
    {deleteState => (
      <Subscribe to={[ErrorState]}>
        {errorState => (
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
                            refetchTree,
                          })
                        }
                      >
                        Löschen
                      </Button>,
                    </DialogActions>
                  </StyledDialog>
                </ErrorBoundary>
              )
            }}
          </Query>
        )}
      </Subscribe>
    )}
  </Subscribe>
)

export default DatasetDeleteModal
