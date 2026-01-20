import { useContext } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react-lite'
import { useLocation } from 'react-router'

import { tables } from '../../../../modules/tables.ts'
import { deleteModule } from './delete/index.ts'
import { MobxContext } from '../../../../mobxContext.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import styles from './index.module.css'

export const DatasetDeleteModal = observer(() => {
  const { search } = useLocation()

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

  const onClickLoeschen = () =>
    deleteModule({
      store,
      search,
    })

  return (
    <ErrorBoundary>
      <Dialog
        open={!!toDeleteId}
        className={styles.dialog}
      >
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
      </Dialog>
    </ErrorBoundary>
  )
})
