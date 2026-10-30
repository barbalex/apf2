import { apiFetch, apiInsert } from '../../modules/api.ts'
import { v7 as uuidv7 } from 'uuid'
import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import AsyncSelect from 'react-select/async'
import { graphql } from '../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'

import type { ApId } from '../../models/apflora/index.ts'

import styles from './ChooseApToCopyEkfrequenzsFrom.module.css'

import {
  addNotificationAtom,
  userNameAtom,
  openChooseApToCopyErfkritsFromAtom,
  setOpenChooseApToCopyErfkritsFromAtom,
} from '../../store/index.ts'

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

  const onChooseAp = async (option: ApOption | null) => {
    if (!option) return
    if (!apId) return
    const newApId = option.value
    // 0. choosing no option is not possible so needs not be cached
    // 1. delete existing erfkrit
    // 1.1: query existing erfkrit
    let existingErfkrits: string[] = []
    try {
      existingErfkrits = (
        (await apiFetch<{ id: string }[]>(
          `/erfkrit?ap_id=eq.${apId}&select=id`,
        )) ?? []
      ).map((e) => e.id)
    } catch (error) {
      console.log({ error })
      setApOptionsError(
        `Fehler beim Abfragen der Arten: ${(error as Error).message}`,
      )
    }

    // 1.2: delete existing erfkrit
    if (existingErfkrits.length) {
      try {
        await apiFetch(`/erfkrit?id=in.(${existingErfkrits.join(',')})`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.log({ error })
        setApOptionsError(
          `Fehler beim Löschen der existierenden Erfolgskriterien: ${(error as Error).message}`,
        )
      }
    }

    // 2. add erfkrit from other ap
    let newErfkrits: { erfolg: number | null; kriterien: string | null }[]
    try {
      newErfkrits =
        (await apiFetch<{ erfolg: number | null; kriterien: string | null }[]>(
          `/erfkrit?ap_id=eq.${newApId}&select=erfolg,kriterien`,
        )) ?? []
    } catch (error) {
      console.log({ error })
      return setApOptionsError(
        `Fehler beim Abfragen der neuen Erfolgskriterien: ${(error as Error).message}`,
      )
    }

    // 2.2: insert erfkrit
    try {
      await apiInsert(
        'erfkrit',
        newErfkrits.map((erfkrit) => ({
          id: uuidv7(),
          ap_id: apId,
          erfolg: erfkrit.erfolg,
          kriterien: erfkrit.kriterien,
          changed_by: userName,
        })),
      )
    } catch (error) {
      console.log('Error adding copied Erfolgskriterien:', error)
      return setApOptionsError(
        `Fehler beim Kopieren der Erfolgskriterien: ${(error as Error).message}`,
      )
    }

    // 3. inform user
    setOpenChooseApToCopyErfkritsFrom(false)
    addNotification({
      message: `Die Erfolgskriterien wurden kopiert`,
      options: { variant: 'info' },
    })
    void tsQueryClient.invalidateQueries({ queryKey: [`treeErfkrit`] })
    void tsQueryClient.invalidateQueries({ queryKey: [`treeApFolders`] })
    void tsQueryClient.invalidateQueries({ queryKey: [`treeAp`] })
  }

  const [apOptionsError, setApOptionsError] = useState<string | undefined>(
    undefined,
  )
  const apOptions = async (inputValue: string): Promise<ApOption[]> => {
    const filter =
      inputValue ?
        {
          label: { includesInsensitive: inputValue },
          id: { notEqualTo: apId },
        }
      : { label: { isNull: false }, id: { notEqualTo: apId } }
    let result: { data?: ApOptionsQueryResult | undefined } | undefined
    try {
      result = await apolloClient.query<ApOptionsQueryResult>({
        // would be elegant to query only ap with erfkrit
        // solution: https://github.com/graphile/pg-aggregates
        query: graphql(`
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
        `),
        variables: { filter },
      })
    } catch (error) {
      console.log({ error })
      setApOptionsError(
        `Fehler beim Abfragen der Arten: ${(error as Error).message}`,
      )
    }
    const options = result?.data?.allAps?.nodes ?? []
    // only show options with erfkrits
    const optionsWithErfkrits = options.filter(
      (e) => e.erfkritsByApId.totalCount > 0,
    )
    return optionsWithErfkrits
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
              onChange={(option) => void onChooseAp(option)}
              hideSelectedOptions
              placeholder=""
              isClearable
              isSearchable
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
