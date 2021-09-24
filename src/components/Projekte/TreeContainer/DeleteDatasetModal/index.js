import React, { useContext, useCallback } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'

import tables from '../../../../modules/tables'
import deleteDataset from './delete'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const StyledDialog = styled(Dialog)`
  > div > div {
    padding: 24px 24px 0 24px;
  }
`

const DatasetDeleteModal = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { toDeleteTable, toDeleteLabel, emptyToDelete, toDeleteId } = store

  const table = tables.find((t) => t.table === toDeleteTable)
  let tableName = null
  if (table && table.labelSingular) {
    tableName = table.labelSingular
  }
  let question = `${tableName ? `${tableName} "` : ''}${toDeleteLabel}${
    tableName ? '"' : ''
  } löschen?`
  if (!toDeleteLabel) {
    question = `${tableName} löschen?`
  }

  const onClickLoeschen = useCallback(
    () =>
      deleteDataset({
        client,
        store,
      }),
    [client, store],
  )

  return (
    <ErrorBoundary>
      <StyledDialog open={!!toDeleteId}>
        {question}
        <DialogActions>
          <Button onClick={emptyToDelete}>Abbrechen</Button>
          <Button color="primary" onClick={onClickLoeschen}>
            Löschen
          </Button>
        </DialogActions>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default observer(DatasetDeleteModal)
