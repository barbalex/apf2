import React, { useContext, useCallback } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'

import tables from '../../../../modules/tables'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import deleteDataset from './delete'
import storeContext from '../../../../storeContext'

const StyledDialog = styled(Dialog)`
  > div > div {
    padding: 24px 24px 0 24px;
  }
`

const DatasetDeleteModal = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { toDeleteTable, toDeleteLabel, emptyToDelete, toDeleteId } = store

  const table = tables.find(t => t.table === toDeleteTable)
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

  const onClickLoeschen = useCallback(() =>
    deleteDataset({
      client,
      store,
    }),
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
          ,
        </DialogActions>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default observer(DatasetDeleteModal)
