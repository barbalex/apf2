// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
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
import clone from 'lodash/clone'
import format from 'date-fns/format'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import TextField from '@material-ui/core/TextField'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import undelete from './undelete'

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
  inject('store'),
  withState('choosenDeletions', 'changeChoosenDeletions', []),
  withHandlers({
    onClickUndo: ({
      choosenDeletions,
      setShowDeletions,
      tree,
      refetchTree,
      store,
    }) => ({
      client,
      datasetsDeleted,
    }) => {
      // loop through all choosenDeletions
      choosenDeletions.forEach(time => {
        const dataset = datasetsDeleted.find(d => d.time === time)
        undelete({
          client,
          datasetsDeleted,
          dataset,
          tree,
          refetchTree,
          setShowDeletions,
        })
      })
      // close window if no more deletions exist
      if (datasetsDeleted.length === 0) {
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
  tree,
  refetchTree,
}: {
  store: Object,
  onClickUndo: () => void,
  choosenDeletions: Array<string>,
  toggleChoosenDeletions: () => void,
  showDeletions: Boolean,
  setShowDeletions: () => void,
  tree: Object,
  refetchTree: () => void,
}) =>
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`
      const datasetsDeleted = get(data, 'datasetsDeleted', [])
        .map(d => JSON.parse(d))
      console.log('Deletions, datasetsDeleted:', datasetsDeleted)

      return (
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
                      key={`${ds.time}`}
                      data-withtopline={index > 0}
                    >
                      <StyledFormControlLabel
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
                      />
                      <TextContainer>
                        <StyledTextField label="Zeit" value={time} fullWidth />
                        <StyledTextField label="Tabelle" value={ds.table} fullWidth />
                        <StyledTextField label="Daten" value={JSON.stringify(dataset, null, 2)} multiline fullWidth />
                      </TextContainer>
                    </Row>
                  )
                })}
              </List>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => onClickUndo({ client, datasetsDeleted })}
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
      )
    }}
  </Query>

export default enhance(Deletions)
