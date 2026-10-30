import { graphql } from '../../gql/index.ts'
import { v7 as uuidv7 } from 'uuid'
import { apiFetch, apiInsert } from '../../modules/api.ts'
import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import AsyncSelect from 'react-select/async'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'

import type { ApId } from '../../models/apflora/index.ts'

import styles from './ChooseApToCopyEkfrequenzsFrom.module.css'

import {
  addNotificationAtom,
  userNameAtom,
  openChooseApToCopyEkfrequenzsFromAtom,
  setOpenChooseApToCopyEkfrequenzsFromAtom,
} from '../../store/index.ts'

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

  const onChooseAp = async (option: ApOption | null) => {
    if (!option) return
    if (!apId) return
    const newApId = option.value
    // 0. choosing no option is not possible so needs not be cached
    // 1. delete existing ekfrequenz
    // 1.1: query existing ekfrequenz
    let existingEkfrequenzs: string[] = []
    try {
      existingEkfrequenzs = (
        (await apiFetch<{ id: string }[]>(
          `/ekfrequenz?ap_id=eq.${apId}&select=id`,
        )) ?? []
      ).map((e) => e.id)
    } catch (error) {
      console.log({ error })
      setApOptionsError(
        `Fehler beim Abfragen der Arten: ${(error as Error).message}`,
      )
    }

    // 1.2: delete existing ekfrequenz
    if (existingEkfrequenzs.length) {
      try {
        await apiFetch(`/ekfrequenz?id=in.(${existingEkfrequenzs.join(',')})`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.log({ error })
        setApOptionsError(
          `Fehler beim Löschen der existierenden EK-Frequenzen: ${(error as Error).message}`,
        )
      }
    }

    // 2. add ekfrequenz from other ap
    // 2.1: query ekfrequenz
    let newEkfrequenzs: {
      anwendungsfall: string | null
      bemerkungen: string | null
      code: string | null
      ek_abrechnungstyp: string | null
      ektyp: string | null
      kontrolljahre: number[] | null
      kontrolljahre_ab: string | null
      sort: number | null
    }[]
    try {
      newEkfrequenzs =
        (await apiFetch(
          `/ekfrequenz?ap_id=eq.${newApId}&select=anwendungsfall,bemerkungen,code,ek_abrechnungstyp,ektyp,kontrolljahre,kontrolljahre_ab:kontrolljahre_ab,sort`,
        )) ?? []
    } catch (error) {
      console.log({ error })
      return setApOptionsError(
        `Fehler beim Abfragen der neuen EK-Frequenzen: ${(error as Error).message}`,
      )
    }

    // 2.2: insert ekfrequenz
    try {
      await apiInsert(
        'ekfrequenz',
        newEkfrequenzs.map((ekf) => ({
          id: uuidv7(),
          ap_id: apId,
          anwendungsfall: ekf.anwendungsfall ?? null,
          bemerkungen: ekf.bemerkungen ?? null,
          code: ekf.code ?? null,
          ek_abrechnungstyp: ekf.ek_abrechnungstyp ?? null,
          ektyp: ekf.ektyp ?? null,
          kontrolljahre: ekf.kontrolljahre ?? null,
          kontrolljahre_ab: ekf.kontrolljahre_ab ?? null,
          sort: ekf.sort ?? null,
          changed_by: userName,
        })),
      )
    } catch (error) {
      console.log('Error adding copied EK-Frequenzen:', error)
      return setApOptionsError(
        `Fehler beim Kopieren der EK-Frequenzen: ${(error as Error).message}`,
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
    void tsQueryClient.invalidateQueries({ queryKey: [`treeEkfrequenz`] })
    void tsQueryClient.invalidateQueries({ queryKey: [`treeApFolders`] })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
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
        // would be elegant to query only ap with ekfrequenz
        // solution: https://github.com/graphile/pg-aggregates
        query: graphql(`
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
        `),
        variables: {
          filter: filter,
        },
      })
    } catch (error) {
      console.log({ error })
      setApOptionsError(
        `Fehler beim Abfragen der Arten: ${(error as Error).message}`,
      )
    }
    const options = result?.data?.allAps?.nodes ?? []
    // only show options with ekfrequenzs
    const optionsWithEkfrequenzs = options.filter(
      (e) => e.ekfrequenzsByApId.totalCount > 0,
    )
    return optionsWithEkfrequenzs
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
