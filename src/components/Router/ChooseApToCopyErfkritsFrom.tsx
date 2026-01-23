import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
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

import { userIsReadOnly } from '../../modules/userIsReadOnly.ts'
import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'

import type { ErfkritId, ApId } from '../../models/apflora/public/Erfkrit.ts'

import styles from './ChooseApToCopyEkfrequenzsFrom.module.css'

import {
  addNotificationAtom,
  userNameAtom,
  openChooseApToCopyErfkritsFromAtom,
  setOpenChooseApToCopyErfkritsFromAtom,
} from '../../store/index.ts'

interface ExistingErfkritNode {
  id: ErfkritId
}

interface ExistingErfkritQueryResult {
  allErfkrits: {
    nodes: ExistingErfkritNode[]
  }
}

interface NewErfkritNode {
  id: ErfkritId
  apId: ApId
  bemerkungen: string | null
  erfolg: number | null
  kriterien: string | null
}

interface NewErfkritQueryResult {
  allErfkrits: {
    nodes: NewErfkritNode[]
  }
}

interface ApOption {
  value: ApId
  label: string | null
  erfkritsByApId: {
    totalCount: number
  }
}

interface ApOptionsQueryResult {
  allAps: {
    nodes: ApOption[]
  }
}

export const ChooseApToCopyErfkritsFrom = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { apId } = useParams()
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()
  const userName = useAtomValue(userNameAtom)
  const openChooseApToCopyErfkritsFrom = useAtomValue(
    openChooseApToCopyErfkritsFromAtom,
  )
  const setOpenChooseApToCopyErfkritsFrom = useSetAtom(
    setOpenChooseApToCopyErfkritsFromAtom,
  )
  const onCloseChooseApDialog = () => setOpenChooseApToCopyErfkritsFrom(false)

  const onChooseAp = async (option) => {
    const newApId = option.value
    // 0. choosing no option is not possible so needs not be cached
    // 1. delete existing erfkrit
    // 1.1: query existing erfkrit
    let existingErfkritResult
    try {
      existingErfkritResult =
        await apolloClient.query<ExistingErfkritQueryResult>({
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
      newErfkritResult = await apolloClient.query<NewErfkritQueryResult>({
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
                $changedBy: String
              ) {
                createErfkrit(
                  input: {
                    erfkrit: {
                      apId: $apId
                      erfolg: $erfolg
                      kriterien: $kriterien
                      changedBy: $changedBy
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
              apId: apId,
              erfolg: ekf.erfolg,
              kriterien: ekf.kriterien,
              changedBy: userName,
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
    addNotification({
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
      result = await apolloClient.query<ApOptionsQueryResult>({
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
          <div className={styles.selectContainer}>
            <div className={styles.selectLabel}>
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
              <div className={styles.errorClass}>{apOptionsError}</div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseChooseApDialog}>abbrechen</Button>
        </DialogActions>
      </Dialog>
    </ErrorBoundary>
  )
}
