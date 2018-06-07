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
import DatasetsDeletedState from '../../../../state/DatasetsDeleted'
import DatasetToDeleteState from '../../../../state/DatasetToDelete'

const StyledDialog = styled(Dialog)`
  > div {
    padding: 24px 24px 0 24px;
  }
`

const DatasetDeleteModal = ({ refetchTree }:{ refetchTree: () => void }) =>
  <Subscribe to={[DatasetsDeletedState]}>
    {datasetsDeletedState => (
      <Subscribe to={[DatasetToDeleteState]}>
        {datasetToDeleteState => (
          <Query query={dataGql}>
            {({ loading, error, data, client }) => {
              if (error) return `Fehler: ${error.message}`
              const datasetToDelete = datasetToDeleteState.state
              const table = tables.find(t => t.table === datasetToDelete.table)
              let tableName = null
              if (table && table.labelSingular) {
                tableName = table.labelSingular
              }

              return (
                <ErrorBoundary>
                  <StyledDialog open={!!datasetToDelete.table}>
                    {`${tableName ? `${tableName} "` : ''}${datasetToDelete.label}${
                      tableName ? '"' : ''
                    } löschen?`}
                    <DialogActions>
                      <Button
                        onClick={() => 
                          datasetToDeleteState.empty()
                        }
                      >
                        Abbrechen
                      </Button>
                      <Button
                        color="primary"
                        onClick={() =>
                          deleteDataset({
                            dataPassedIn: data,
                            datasetsDeletedState,
                            datasetToDeleteState,
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

export default DatasetDeleteModal
