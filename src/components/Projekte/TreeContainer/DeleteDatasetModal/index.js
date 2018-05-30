// @flow
import React from 'react'
import { inject } from 'mobx-react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import tables from '../../../../modules/tables'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import setDatasetToDelete from './setDatasetToDelete.graphql'
import deleteDataset from './delete'

const StyledDialog = styled(Dialog)`
  > div {
    padding: 24px 24px 0 24px;
  }
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onClickDelete: props => () => props.store.deleteDatasetExecute(props.tree),
  })
)

const DatasetDeleteModal = ({
  store,
  onClickDelete,
  refetchTree,
}: {
  store: Object,
  onClickDelete: () => void,
  refetchTree: () => void,
}) =>
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`
      const datasetToDelete = get(data, 'datasetToDelete')
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
                onClick={() => {
                  client.mutate({
                    mutation: setDatasetToDelete,
                    variables: {
                      table: null,
                      id: datasetToDelete.id,
                      label: null,
                      url: null,
                    }
                  })
                }}
              >
                Abbrechen
              </Button>
              <Button
                color="primary"
                onClick={() =>
                  deleteDataset({
                    client,
                    data,
                    refetchTree
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

export default enhance(DatasetDeleteModal)
