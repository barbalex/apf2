import { memo, useContext, useCallback } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import { useLocation } from 'react-router'

import { tables } from '../../../../modules/tables.js'
import { deleteModule } from './delete/index.jsx'
import { MobxContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

const StyledDialog = styled(Dialog)`
  > div > div {
    padding: 24px 24px 0 24px;
  }
`

export const DatasetDeleteModal = memo(
  observer(() => {
    const { search } = useLocation()

    const client = useApolloClient()
    const store = useContext(MobxContext)
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
        deleteModule({
          client,
          store,
          search,
        }),
      [client, search, store],
    )

    return (
      <ErrorBoundary>
        <StyledDialog open={!!toDeleteId}>
          {question}
          <DialogActions>
            <Button
              onClick={emptyToDelete}
              color="inherit"
            >
              Abbrechen
            </Button>
            <Button
              color="primary"
              onClick={onClickLoeschen}
            >
              Löschen
            </Button>
          </DialogActions>
        </StyledDialog>
      </ErrorBoundary>
    )
  }),
)
