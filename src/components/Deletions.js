// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import clone from 'lodash/clone'
import format from 'date-fns/format'

import ErrorBoundary from './shared/ErrorBoundary'

const StyledDialog = styled(Dialog)`
  max-width: ${window.innerWidth * 0.8}px;
`
const List = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  flex-direction: column;
`
const StyledFormControlLabel = styled(FormControlLabel)`
  margin-left: 0 !important;
  padding: 8px 0;
  border-top: ${props =>
    props['data-withtopline'] ? '1px solid rgba(0,0,0,0.1)' : 'none'};
`
const StyledCheckbox = styled(Checkbox)`
  width: 30px !important;
  height: 30px !important;
`

const enhance = compose(
  inject('store'),
  withState('choosenDeletions', 'changeChoosenDeletions', []),
  withHandlers({
    onClickUndo: ({ choosenDeletions, setShowDeletions, store }) => () => {
      const { undoDeletion, deletedDatasets } = store
      // loop through all choosenDeletions
      choosenDeletions.forEach(time => {
        let deletedDataset = deletedDatasets.find(d => d.time === time)
        // insert them to db
        // and to store
        undoDeletion(deletedDataset)
      })
      // close window if no more deletions exist
      if (deletedDatasets.length === 0) {
        setShowDeletions(false)
      }
    },
    toggleChoosenDeletions: ({ choosenDeletions, changeChoosenDeletions }) => event => {
      let time = event.target.value
      if (time) time = +time
      const previousChoosenDeletions = clone(choosenDeletions)
      let newChoosenDeletions
      if (choosenDeletions.includes(time)) {
        newChoosenDeletions = previousChoosenDeletions.filter(d => d !== time)
      } else {
        newChoosenDeletions = [...choosenDeletions, time]
      }
      changeChoosenDeletions(newChoosenDeletions)
    },
  }),
  observer
)

const Deletions = ({
  store,
  onClickUndo,
  choosenDeletions,
  changeChoosenDeletions,
  toggleChoosenDeletions,
  showDeletions,
  setShowDeletions,
}: {
  store: Object,
  onClickUndo: () => void,
  choosenDeletions: Array<string>,
  toggleChoosenDeletions: () => void,
  showDeletions: Boolean,
  setShowDeletions: () => void,
}) => {
  return (
    <ErrorBoundary>
      <StyledDialog
        aria-labelledby="dialog-title"
        open={showDeletions}
      >
        <DialogTitle id="dialog-title">gelöschte Datensätze</DialogTitle>
        <List>
          {store.deletedDatasets.map((ds, index) => {
            const dataset = clone(ds.dataset)
            // remove null values
            Object.keys(dataset).forEach(
              key => dataset[key] == null && delete dataset[key]
            )
            const time = format(new Date(ds.time), 'YYYY.MM.DD HH:mm:ss')
            const label = `${time}: Tabelle "${ds.table}": ${JSON.stringify(
              dataset
            )}`

            return (
              <StyledFormControlLabel
                key={`${ds.time}`}
                control={
                  <StyledCheckbox
                    checked={choosenDeletions.includes(ds.time)}
                    onChange={toggleChoosenDeletions}
                    value={
                      ds.time && ds.time.toString() ? ds.time.toString() : ''
                    }
                    color="primary"
                  />
                }
                label={label}
                data-withtopline={index > 0}
              />
            )
          })}
        </List>
        <DialogActions>
          <Button
            onClick={onClickUndo}
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
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default enhance(Deletions)
