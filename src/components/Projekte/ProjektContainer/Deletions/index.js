// @flow
import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import format from 'date-fns/format'
import TextField from '@material-ui/core/TextField'
import { Subscribe } from 'unstated'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import undelete from './undelete'
import DeleteState from '../../../../state/Delete'
import ErrorState from '../../../../state/Error'

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
  border-top: ${props =>
    props['data-withtopline'] ? '1px solid rgba(0,0,0,0.1)' : 'none'};
  padding-top: ${props =>
    props['data-withtopline'] ? '10px' : 'unset'};
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

const enhance = compose(
  withState('choosenDeletions', 'setChoosenDeletions', []),
  withHandlers({
    onClickUndo: ({
      choosenDeletions,
      setChoosenDeletions,
      setShowDeletions,
      tree,
      refetchTree,
    }) => async ({
      datasetsDeleted,
      deleteState,
      errorState,
    }) => {
      // loop through all choosenDeletions
      await choosenDeletions.forEach(async id => {
        const dataset = datasetsDeleted.find(d => d.id === id)
        await undelete({
          datasetsDeleted,
          dataset,
          tree,
          refetchTree,
          setShowDeletions,
          deleteState,
          errorState,
        })
      })
      setChoosenDeletions([])
      // close window if no more deletions exist
      if (datasetsDeleted.length === 0) {
        setShowDeletions(false)
      }
    },
    toggleChoosenDeletions: ({ choosenDeletions, setChoosenDeletions }) => event => {
      let id = event.target.value
      let newChoosenDeletions
      if (choosenDeletions.includes(id)) {
        newChoosenDeletions = choosenDeletions.filter(d => d !== id)
      } else {
        newChoosenDeletions = [...choosenDeletions, id]
      }
      setChoosenDeletions(newChoosenDeletions)
    },
  }),
)

const Deletions = ({
  onClickUndo,
  choosenDeletions,
  setChoosenDeletions,
  toggleChoosenDeletions,
  showDeletions,
  setShowDeletions,
  tree,
  refetchTree,
}: {
  onClickUndo: () => void,
  choosenDeletions: Array<string>,
  toggleChoosenDeletions: () => void,
  showDeletions: Boolean,
  setShowDeletions: () => void,
  tree: Object,
  refetchTree: () => void,
}) =>
  <Subscribe to={[DeleteState]}>
    {deleteState => {
      const datasetsDeleted = deleteState.state.datasets
      console.log('Deletions, render:', {datasetsDeleted})

      return (
        <Subscribe to={[ErrorState]}>
          {errorState =>
            <ErrorBoundary>
              <Dialog
                aria-labelledby="dialog-title"
                open={showDeletions && datasetsDeleted.length > 0}
              >
                <DialogTitle id="dialog-title">gelöschte Datensätze</DialogTitle>
                <DialogContent>
                  <List>
                    {datasetsDeleted.map((ds, index) => {
                      // clone to remove keys _only_ for presentation
                      const dataset = { ...ds.data }
                      // remove null values
                      Object.keys(dataset).forEach(
                        key => dataset[key] == null && delete dataset[key]
                      )
                      const time = format(new Date(ds.time), 'YYYY.MM.DD HH:mm:ss')

                      return (
                        <Row
                          key={ds.id}
                          data-withtopline={index > 0}
                        >
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
                            <StyledTextField label="Lösch-Zeitpunkt" value={time} fullWidth />
                            <StyledTextField label="Tabelle" value={ds.table} fullWidth />
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
                    onClick={() =>
                      onClickUndo({ datasetsDeleted, deleteState, errorState })
                    }
                    disabled={choosenDeletions.length === 0}
                  >
                    wiederherstellen
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => setShowDeletions(false)}
                  >
                    schliessen
                  </Button>
                </DialogActions>
              </Dialog>
            </ErrorBoundary>
          }
        </Subscribe>
      )}
    }
  </Subscribe>

export default enhance(Deletions)
