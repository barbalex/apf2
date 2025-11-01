import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import AsyncSelect from 'react-select/async'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { userIsReadOnly } from '../../modules/userIsReadOnly.js'
import { MobxContext } from '../../mobxContext.js'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

import {
  selectContainer,
  selectLabel,
  errorClass,
} from './ChooseApToCopyEkfrequenzsFrom.module.css'

export const ChooseApToCopyErfkritsFrom = observer(() => {
  const { apId } = useParams()
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()
  const store = useContext(MobxContext)
  const {
    user,
    enqueNotification,
    openChooseApToCopyErfkritsFrom,
    setOpenChooseApToCopyErfkritsFrom,
  } = store

  const onCloseChooseApDialog = () => setOpenChooseApToCopyErfkritsFrom(false)

  const onChooseAp = async (option) => {
    const newApId = option.value
    // 0. choosing no option is not possible so needs not be catched
    // 1. delete existing erfkrit
    // 1.1: query existing erfkrit
    let existingErfkritResult
    try {
      existingErfkritResult = await apolloClient.query({
        query: gql`
          query getExistingErfkritForErfkritFolder($apId: UUID) {
            allErfkrits(filter: { apId: { equalTo: $apId } }) {
              nodes {
                id
              }
            }
          }
        `,
        variables: { apId },
        // got errors when not setting 'network-only' policy
        // when copying repeatedly
        // apollo seemed to use local cache which was not up to date any more
        // so probably not the newly inserted were queried but the earlier deleted ones
        // which created conflicts with uniqueness
        fetchPolicy: 'network-only',
      })
    } catch (error) {
      console.log({ error })
      setApOptionsError(`Fehler beim Abfragen der Arten: ${error.message}`)
    }
    const existingErfkrits = (
      existingErfkritResult?.data?.allErfkrits?.nodes ?? []
    ).map((e) => e.id)

    // 1.2: delete existing erfkrit
    try {
      await Promise.allSettled(
        existingErfkrits.map(
          async (id) =>
            await apolloClient.mutate({
              mutation: gql`
                mutation deleteExistingErfkritForErfkritFolder($id: UUID!) {
                  deleteErfkritById(input: { id: $id }) {
                    deletedErfkritId
                  }
                }
              `,
              variables: { id },
              update(cache) {
                cache.evict({ id })
              },
            }),
        ),
      )
    } catch (error) {
      console.log({ error })
      setApOptionsError(
        `Fehler beim Löschen der existierenden Erfolgskriterien: ${error.message}`,
      )
    }

    // 2. add erfkrit from other ap
    // 2.1: query erfkrit
    let newErfkritResult
    try {
      newErfkritResult = await apolloClient.query({
        query: gql`
          query getNewErfkritForErfkritFolder($apId: UUID) {
            allErfkrits(filter: { apId: { equalTo: $apId } }) {
              nodes {
                id
                apId
                erfolg
                kriterien
              }
            }
          }
        `,
        variables: { apId: newApId },
      })
    } catch (error) {
      console.log({ error })
      return setApOptionsError(
        `Fehler beim Abfragen der neuen Erfolgskriterien: ${error.message}`,
      )
    }
    const newErfkrits = newErfkritResult?.data?.allErfkrits?.nodes ?? []

    // 2.2: insert erfkrit
    let res
    try {
      res = await Promise.allSettled(
        newErfkrits.map(async (ekf) =>
          apolloClient.mutate({
            mutation: gql`
              mutation insertErfkritForErfkritFolder(
                $apId: UUID!
                $erfolg: Int
                $kriterien: String
              ) {
                createErfkrit(
                  input: {
                    erfkrit: {
                      apId: $apId
                      erfolg: $erfolg
                      kriterien: $kriterien
                    }
                  }
                ) {
                  erfkrit {
                    id
                    apId
                    erfolg
                    kriterien
                    changedBy
                  }
                }
              }
            `,
            // somehow in dev i got errors claiming the strings were not utf-8
            // invalid byte sequence for encoding "UTF8"
            variables: {
              anwendungsfall: ekf.anwendungsfall,
              apId: apId,
              erfolg: ekf.erfolg,
              kriterien: ekf.kriterien,
              changedBy: user.name,
            },
          }),
        ),
      )
    } catch (error) {
      console.log('Error adding copied Erfolgskriterien:', error)
      return setApOptionsError(
        `Fehler beim Kopieren der Erfolgskriterien: ${error.message}`,
      )
    }

    // 3. inform user
    setOpenChooseApToCopyErfkritsFrom(false)
    enqueNotification({
      message: `Die Erfolgskriterien wurden kopiert`,
      options: { variant: 'info' },
    })
    tsQueryClient.invalidateQueries({ queryKey: [`treeErfkrit`] })
    tsQueryClient.invalidateQueries({ queryKey: [`treeApFolders`] })
    tsQueryClient.invalidateQueries({ queryKey: [`treeAp`] })
  }

  const [apOptionsError, setApOptionsError] = useState(undefined)
  const apOptions = async (inputValue, cb) => {
    if (apId === 0) return
    const filter =
      inputValue ?
        {
          label: { includesInsensitive: inputValue },
          id: { notEqualTo: apId },
        }
      : { label: { isNull: false }, id: { notEqualTo: apId } }
    let result
    try {
      result = await apolloClient.query({
        // would be elegant to query only ap with erfkrit
        // solution: https://github.com/graphile/pg-aggregates
        query: gql`
          query apForErfkritfolder($filter: ApFilter) {
            allAps(orderBy: [LABEL_ASC], filter: $filter) {
              nodes {
                value: id
                label
                erfkritsByApId {
                  totalCount
                }
              }
            }
          }
        `,
        variables: { filter },
      })
    } catch (error) {
      console.log({ error })
      setApOptionsError(`Fehler beim Abfragen der Arten: ${error.message}`)
    }
    const options = result?.data?.allAps?.nodes ?? []
    // only show options with erfkrits
    const optionsWithErfkrits = options.filter(
      (e) => e.erfkritsByApId.totalCount > 0,
    )
    cb(optionsWithErfkrits)
  }

  return (
    <ErrorBoundary>
      <Dialog
        open={openChooseApToCopyErfkritsFrom}
        onClose={onCloseChooseApDialog}
      >
        <DialogTitle>Erfolgskriterien aus anderer Art kopieren</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Achtung: Allfällige bestehende Erfolgskriterien werden gelöscht und
            mit den kopierten ersetzt, sobald Sie einen Aktionsplän wählen
          </DialogContentText>
          <div className={selectContainer}>
            <div className={selectLabel}>
              Art (nur solche mit Erfolgskriterien)
            </div>
            <AsyncSelect
              autoFocus
              defaultOptions
              name="ap"
              onChange={onChooseAp}
              value=""
              hideSelectedOptions
              placeholder=""
              isClearable
              isSearchable
              // remove as can't select without typing
              nocaret
              // don't show a no options message if a value exists
              noOptionsMessage={() => '(Bitte Tippen für Vorschläge)'}
              // enable deleting typed values
              backspaceRemovesValue
              classNamePrefix="react-select"
              loadOptions={apOptions}
              openMenuOnFocus
              className="select-nocaret"
            />
            {apOptionsError && (
              <div className={errorClass}>{apOptionsError}</div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseChooseApDialog}>abbrechen</Button>
        </DialogActions>
      </Dialog>
    </ErrorBoundary>
  )
})
