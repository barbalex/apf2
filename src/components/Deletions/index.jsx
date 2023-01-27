import React, { useContext, useState, useCallback } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import styled from '@emotion/styled'
import { DateTime } from 'luxon'
import TextField from '@mui/material/TextField'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'

import undelete from './undelete'
import storeContext from '../../storeContext'
import ErrorBoundary from '../shared/ErrorBoundary'

const List = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  flex-direction: column;
  width: 500px;
  max-width: ${window.innerWidth * 0.8}px;
`
const Row = styled.div`
  display: flex;
  border-top: ${(props) =>
    props['data-withtopline'] ? '1px solid rgba(0,0,0,0.1)' : 'none'};
  padding-top: ${(props) => (props['data-withtopline'] ? '10px' : 'unset')};
`
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const StyledTextField = styled(TextField)`
  padding-bottom: 9px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0) !important;
  }
`
const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0 !important;
  padding: 8px 0;
`
const StyledCheckbox = styled(Checkbox)`
  width: 30px !important;
  height: 30px !important;
`

const Deletions = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const {
    removeDeletedDatasetById,
    deletedDatasets,
    showDeletions,
    setShowDeletions,
  } = store

  const [choosenDeletions, setChoosenDeletions] = useState([])

  const onClickUndo = useCallback(async () => {
    // loop through all choosenDeletions
    await Promise.all(
      choosenDeletions.map(
        async (id) =>
          await undelete({
            deletedDatasets,
            dataset: deletedDatasets.find((d) => d.id === id),
            setShowDeletions,
            removeDeletedDatasetById,
            client,
            store,
          }),
      ),
    )
    setChoosenDeletions([])
    if (choosenDeletions.length === deletedDatasets.length) {
      setShowDeletions(false)
    }
  }, [
    choosenDeletions,
    client,
    deletedDatasets,
    removeDeletedDatasetById,
    setShowDeletions,
    store,
  ])
  const toggleChoosenDeletions = useCallback(
    (event) => {
      const id = event.target.value
      let newChoosenDeletions
      if (choosenDeletions.includes(id)) {
        newChoosenDeletions = choosenDeletions.filter((d) => d !== id)
      } else {
        newChoosenDeletions = [...choosenDeletions, id]
      }
      setChoosenDeletions(newChoosenDeletions)
    },
    [choosenDeletions],
  )
  const onClickClose = useCallback(
    () => setShowDeletions(false),
    [setShowDeletions],
  )

  return (
    <ErrorBoundary>
      <Dialog
        aria-labelledby="dialog-title"
        open={showDeletions && deletedDatasets.length > 0}
      >
        <DialogTitle id="dialog-title">gelöschte Datensätze</DialogTitle>
        <DialogContent>
          <List>
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
                <Row key={ds.id} data-withtopline={index > 0}>
                  <StyledFormControlLabel
                    control={
                      <StyledCheckbox
                        checked={choosenDeletions.includes(ds.id)}
                        onChange={toggleChoosenDeletions}
                        value={ds.id}
                        color="primary"
                      />
                    }
                  />
                  <TextContainer>
                    <StyledTextField
                      label="Lösch-Zeitpunkt"
                      value={time}
                      fullWidth
                    />
                    <StyledTextField
                      label="Tabelle"
                      value={ds.table}
                      fullWidth
                    />
                    <StyledTextField
                      label="Daten"
                      value={JSON.stringify(dataset, null, 2)}
                      multiline
                      fullWidth
                    />
                  </TextContainer>
                </Row>
              )
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClickUndo}
            disabled={choosenDeletions.length === 0}
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

export default observer(Deletions)
