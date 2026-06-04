import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { DateTime } from 'luxon'
import TextField from '@mui/material/TextField'
import { useApolloClient } from '@apollo/client/react'
import { useAtomValue, useSetAtom } from 'jotai'

import { undelete } from './undelete/index.ts'
import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'
import {
  deletedDatasetsAtom,
  showDeletionsAtom,
  setShowDeletionsAtom,
} from '../../store/index.ts'

import styles from './index.module.css'

export const Deletions = () => {
  const apolloClient = useApolloClient()
  const showDeletions = useAtomValue(showDeletionsAtom)
  const setShowDeletions = useSetAtom(setShowDeletionsAtom)
  const deletedDatasets = useAtomValue(deletedDatasetsAtom)

  const [chosenDeletions, setChosenDeletions] = useState([])

  const onClickUndo = async () => {
    // loop through all chosenDeletions
    await Promise.all(chosenDeletions.map(async (id) => await undelete({ id })))
    setChosenDeletions([])
    if (chosenDeletions.length === deletedDatasets.length) {
      setShowDeletions(false)
    }
  }

  const toggleChoosenDeletions = (event) => {
    const id = event.target.value
    let newChoosenDeletions
    if (chosenDeletions.includes(id)) {
      newChoosenDeletions = chosenDeletions.filter((d) => d !== id)
    } else {
      newChoosenDeletions = [...chosenDeletions, id]
    }
    setChosenDeletions(newChoosenDeletions)
  }

  const onClickClose = () => setShowDeletions(false)

  return (
    <ErrorBoundary>
      <Dialog
        aria-labelledby="dialog-title"
        open={showDeletions && deletedDatasets.length > 0}
      >
        <DialogTitle id="dialog-title">gelöschte Datensätze</DialogTitle>
        <DialogContent>
          <div
            className={styles.list}
            style={{ maxWidth: window.innerWidth * 0.8 }}
          >
            {deletedDatasets.map((ds, index) => {
              // clone to remove keys _only_ for presentation
              const dataset = { ...ds.data }
              // remove null values
              Object.keys(dataset).forEach(
                (key) => dataset[key] == null && delete dataset[key],
              )
              const time = DateTime.fromMillis(ds.time).toFormat(
                'yyyy.LL.dd HH:mm:ss',
              )

              return (
                <div
                  className={styles.row}
                  key={ds.id}
                  style={{
                    borderTop: index > 0 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                    paddingTop: index > 0 ? '10px' : 'unset',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={chosenDeletions.includes(ds.id)}
                        onChange={toggleChoosenDeletions}
                        value={ds.id}
                        color="primary"
                        className={styles.checkbox}
                      />
                    }
                    className={styles.formControlLabel}
                  />
                  <div className={styles.textContainer}>
                    <TextField
                      label="Lösch-Zeitpunkt"
                      value={time}
                      fullWidth
                      className={styles.textField}
                    />
                    <TextField
                      label="Tabelle"
                      value={ds.table}
                      fullWidth
                      className={styles.textField}
                    />
                    <TextField
                      label="Daten"
                      value={JSON.stringify(dataset, null, 2)}
                      multiline
                      fullWidth
                      className={styles.textField}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClickUndo}
            disabled={chosenDeletions.length === 0}
            color="inherit"
          >
            wiederherstellen
          </Button>
          <Button color="primary" onClick={onClickClose}>
            schliessen
          </Button>
        </DialogActions>
      </Dialog>
    </ErrorBoundary>
  )
}
