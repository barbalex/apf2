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

import type {
  EkfrequenzId,
  ApId,
} from '../../models/apflora/public/Ekfrequenz.ts'

import styles from './ChooseApToCopyEkfrequenzsFrom.module.css'

import {
  addNotificationAtom,
  userNameAtom,
  openChooseApToCopyEkfrequenzsFromAtom,
  setOpenChooseApToCopyEkfrequenzsFromAtom,
} from '../../store/index.ts'

interface ExistingEkfrequenzNode {
  id: EkfrequenzId
}

interface ExistingEkfrequenzQueryResult {
  allEkfrequenzs: {
    nodes: ExistingEkfrequenzNode[]
  }
}

interface NewEkfrequenzNode {
  id: EkfrequenzId
  anwendungsfall: string | null
  apId: ApId
  bemerkungen: string | null
  code: string | null
  ekAbrechnungstyp: string | null
  ektyp: string | null
  kontrolljahre: number[] | null
  kontrolljahreAb: string | null
  sort: number | null
}

interface NewEkfrequenzQueryResult {
  allEkfrequenzs: {
    nodes: NewEkfrequenzNode[]
  }
}

interface ApOption {
  value: ApId
  label: string | null
  ekfrequenzsByApId: {
    totalCount: number
  }
}

interface ApOptionsQueryResult {
  allAps: {
    nodes: ApOption[]
  }
}

export const ChooseApToCopyEkfrequenzsFrom = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { apId } = useParams()
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()
  const userName = useAtomValue(userNameAtom)
  const openChooseApToCopyEkfrequenzsFrom = useAtomValue(
    openChooseApToCopyEkfrequenzsFromAtom,
  )
  const setOpenChooseApToCopyEkfrequenzsFrom = useSetAtom(
    setOpenChooseApToCopyEkfrequenzsFromAtom,
  )
  const onCloseChooseApDialog = () =>
    setOpenChooseApToCopyEkfrequenzsFrom(false)

  const onChooseAp = async (option) => {
    const newApId = option.value
    // 0. choosing no option is not possible so needs not be cached
    // 1. delete existing ekfrequenz
    // 1.1: query existing ekfrequenz
    let existingEkfrequenzResult
    try {
      existingEkfrequenzResult =
        await apolloClient.query<ExistingEkfrequenzQueryResult>({
          query: gql`
            query getExistingEkfrequenzForEkfrequenzFolder($apId: UUID) {
              allEkfrequenzs(filter: { apId: { equalTo: $apId } }) {
                nodes {
                  id
                }
              }
            }
          `,
          variables: {
            apId,
          },
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
    const existingEkfrequenzs = (
      existingEkfrequenzResult?.data?.allEkfrequenzs?.nodes ?? []
    ).map((e) => e.id)

    // 1.2: delete existing ekfrequenz
    try {
      await Promise.allSettled(
        existingEkfrequenzs.map(
          async (id) =>
            await apolloClient.mutate({
              mutation: gql`
                mutation deleteExistingEkfrequenzForEkfrequenzFolder(
                  $id: UUID!
                ) {
                  deleteEkfrequenzById(input: { id: $id }) {
                    deletedEkfrequenzId
                  }
                }
              `,
              variables: {
                id,
              },
              update(cache) {
                cache.evict({ id })
              },
            }),
        ),
      )
    } catch (error) {
      console.log({ error })
      setApOptionsError(
        `Fehler beim Löschen der existierenden EK-Frequenzen: ${error.message}`,
      )
    }

    // 2. add ekfrequenz from other ap
    // 2.1: query ekfrequenz
    let newEkfrequenzResult
    try {
      newEkfrequenzResult = await apolloClient.query<NewEkfrequenzQueryResult>({
        query: gql`
          query getNewEkfrequenzForEkfrequenzFolder($apId: UUID) {
            allEkfrequenzs(filter: { apId: { equalTo: $apId } }) {
              nodes {
                id
                anwendungsfall
                apId
                bemerkungen
                code
                ekAbrechnungstyp
                ektyp
                kontrolljahre
                kontrolljahreAb
                sort
              }
            }
          }
        `,
        variables: {
          apId: newApId,
        },
      })
    } catch (error) {
      console.log({ error })
      return setApOptionsError(
        `Fehler beim Abfragen der neuen EK-Frequenzen: ${error.message}`,
      )
    }
    const newEkfrequenzs =
      newEkfrequenzResult?.data?.allEkfrequenzs?.nodes ?? []

    // 2.2: insert ekfrequenz
    let res
    try {
      res = await Promise.allSettled(
        newEkfrequenzs.map(async (ekf) =>
          apolloClient.mutate({
            mutation: gql`
              mutation insertEkfrequenzForEkfrequenzFolder(
                $apId: UUID!
                $anwendungsfall: String
                $bemerkungen: String
                $changedBy: String
                $code: String
                $ekAbrechnungstyp: String
                $ektyp: EkType
                $kontrolljahre: [Int]
                $kontrolljahreAb: EkKontrolljahreAb
                $sort: Int
              ) {
                createEkfrequenz(
                  input: {
                    ekfrequenz: {
                      apId: $apId
                      anwendungsfall: $anwendungsfall
                      bemerkungen: $bemerkungen
                      code: $code
                      ekAbrechnungstyp: $ekAbrechnungstyp
                      ektyp: $ektyp
                      kontrolljahre: $kontrolljahre
                      kontrolljahreAb: $kontrolljahreAb
                      sort: $sort
                      changedBy: $changedBy
                    }
                  }
                ) {
                  ekfrequenz {
                    id
                    apId
                    anwendungsfall
                    bemerkungen
                    code
                    ekAbrechnungstyp
                    ektyp
                    kontrolljahre
                    kontrolljahreAb
                    sort
                    changedBy
                  }
                }
              }
            `,
            // somehow in dev i got errors claiming the strings were not utf-8
            // invalid byte sequence for encoding "UTF8"
            variables: {
              apId: apId,
              anwendungsfall: ekf.anwendungsfall ?? null,
              bemerkungen: ekf.bemerkungen ?? null,
              code: ekf.code ?? null,
              ekAbrechnungstyp: ekf.ekAbrechnungstyp ?? null,
              ektyp: ekf.ektyp ?? null,
              kontrolljahre: ekf.kontrolljahre ?? null,
              kontrolljahreAb: ekf.kontrolljahreAb ?? null,
              sort: ekf.sort ?? null,
              changedBy: userName,
            },
          }),
        ),
      )
    } catch (error) {
      console.log('Error adding copied EK-Frequenzen:', error)
      return setApOptionsError(
        `Fehler beim Kopieren der EK-Frequenzen: ${error.message}`,
      )
    }
    // console.log('ChooseApToCopyEkfrequenzsFrom, res:', res)

    // 3. inform user
    setOpenChooseApToCopyEkfrequenzsFrom(false)
    addNotification({
      message: `Die EK-Frequenzen wurden kopiert`,
      options: {
        variant: 'info',
      },
    })
    tsQueryClient.invalidateQueries({ queryKey: [`treeEkfrequenz`] })
    tsQueryClient.invalidateQueries({ queryKey: [`treeApFolders`] })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
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
        // would be elegant to query only ap with ekfrequenz
        // solution: https://github.com/graphile/pg-aggregates
        query: gql`
          query apForEkfrequenzfolder($filter: ApFilter) {
            allAps(orderBy: [LABEL_ASC], filter: $filter) {
              nodes {
                value: id
                label
                ekfrequenzsByApId {
                  totalCount
                }
              }
            }
          }
        `,
        variables: {
          filter: filter,
        },
      })
    } catch (error) {
      console.log({ error })
      setApOptionsError(`Fehler beim Abfragen der Arten: ${error.message}`)
    }
    const options = result?.data?.allAps?.nodes ?? []
    // only show options with ekfrequenzs
    const optionsWithEkfrequenzs = options.filter(
      (e) => e.ekfrequenzsByApId.totalCount > 0,
    )
    cb(optionsWithEkfrequenzs)
  }

  return (
    <ErrorBoundary>
      <Dialog
        open={openChooseApToCopyEkfrequenzsFrom}
        onClose={onCloseChooseApDialog}
      >
        <DialogTitle>EK-Frequenzen aus anderer Art kopieren</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Achtung: Allfällige bestehende EK-Frequenzen werden gelöscht und mit
            den kopierten ersetzt, sobald Sie eine Art wählen
          </DialogContentText>
          <div className={styles.selectContainer}>
            <div className={styles.selectLabel}>
              Art (nur solche mit EK-Frequenzen)
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
