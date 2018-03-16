// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Checkbox from 'material-ui/Checkbox'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import clone from 'lodash/clone'
import format from 'date-fns/format'

import ErrorBoundary from './shared/ErrorBoundary'

const List = styled.div`
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
  const actions = [
    <FlatButton
      label="wiederherstellen"
      primary={false}
      onClick={onClickUndo}
      disabled={choosenDeletions.length === 0}
    />,
    <FlatButton label="schliessen" primary={true} onClick={close} />,
  ]

  return (
    <ErrorBoundary>
      <Dialog
        title="gelöschte Datensätze"
        open={store.showDeletedDatasets}
        actions={actions}
        contentStyle={{
          maxWidth: window.innerWidth * 0.8,
        }}
      >
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
      </Dialog>
    </ErrorBoundary>
  )
}

export default enhance(Deletions)
