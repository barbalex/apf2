import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useLocation } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'

import { tables } from '../../../../modules/tables.ts'
import { deleteModule } from './delete/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  toDeleteAtom,
  emptyToDeleteAtom,
} from '../../../../JotaiStore/index.ts'

import styles from './index.module.css'

export const DatasetDeleteModal = () => {
  const { search } = useLocation()

  const toDelete = useAtomValue(toDeleteAtom)
  const emptyToDelete = useSetAtom(emptyToDeleteAtom)

  const table = tables.find((t) => t.table === toDelete.table)
  let tableName = null
  if (table && table.labelSingular) {
    tableName = table.labelSingular
  }
  let question = `${tableName ? `${tableName} "` : ''}${toDelete.label}${
    tableName ? '"' : ''
  } löschen?`
  if (!toDelete.label) {
    question = `${tableName} löschen?`
  }

  const onClickLoeschen = () => deleteModule({ search })

  return (
    <ErrorBoundary>
      <Dialog
        open={!!toDelete.id}
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
}
