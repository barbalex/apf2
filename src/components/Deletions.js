// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import Dialog, { DialogTitle, DialogActions } from 'material-ui-next/Dialog'
import Button from 'material-ui-next/Button'
import Checkbox from 'material-ui/Checkbox'
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

const enhance = compose(
  inject('store'),
  withState('choosenDeletions', 'changeChoosenDeletions', []),
  withHandlers({
    onClickUndo: props => () => {
      const { undoDeletion, deletedDatasets } = props.store
      const { choosenDeletions } = props
      // loop through all choosenDeletions
      choosenDeletions.forEach(time => {
        let deletedDataset = deletedDatasets.find(d => d.time === time)
        // insert them to db
        // and to store
        undoDeletion(deletedDataset)
      })
    },
    close: props => () => {
      props.store.toggleShowDeletedDatasets()
    },
    toggleChoosenDeletions: props => event => {
      const { choosenDeletions, changeChoosenDeletions } = props
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
  close,
  choosenDeletions,
  changeChoosenDeletions,
  toggleChoosenDeletions,
}: {
  store: Object,
  onClickUndo: () => void,
  close: () => void,
  choosenDeletions: Array<string>,
  toggleChoosenDeletions: () => void,
}) => {
  return (
    <ErrorBoundary>
      <StyledDialog
        aria-labelledby="dialog-title"
        open={store.showDeletedDatasets}
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
              <Checkbox
                key={`${ds.time}`}
                label={label}
                value={ds.time}
                checked={choosenDeletions.includes(ds.time)}
                onCheck={toggleChoosenDeletions}
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
          <Button primary onClick={close}>
            schliessen
          </Button>
        </DialogActions>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default enhance(Deletions)
