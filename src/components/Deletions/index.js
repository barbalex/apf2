import React, { useContext, useState, useCallback } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import styled from 'styled-components'
import format from 'date-fns/format'
import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/react-hooks'

import undelete from './undelete'
import storeContext from '../../storeContext'
import ErrorBoundary from '../shared/ErrorBoundary'

const List = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  flex-direction: column;
  width: 500px;
  max-width: ${typeof window !== 'undefined' && window.innerWidth * 0.8}px;
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
      let id = event.target.value
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
  const onClickClose = useCallback(() => setShowDeletions(false), [
    setShowDeletions,
  ])

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
              const time = format(new Date(ds.time), 'yyyy.MM.dd HH:mm:ss')

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
