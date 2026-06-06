import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import { useParams } from 'react-router'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useAtomValue } from 'jotai'
import { Tooltip, IconButton, Menu as MuiMenu, MenuItem } from '@mui/material'
import { MdCheck } from 'react-icons/md'
import { FaMinus } from 'react-icons/fa'

import { TextField } from '../../../../shared/TextField.tsx'
import { Select } from '../../../../shared/Select.tsx'
import { ifIsNumericAsNumber } from '../../../../../modules/ifIsNumericAsNumber.ts'
import { userNameAtom } from '../../../../../store/index.ts'
import { apHistory } from '../../../../shared/fragments.ts'

import styles from './HistoryForm.module.css'

const fieldTypes: Record<string, string> = {
  year: 'Int',
  bearbeitung: 'Int',
  startJahr: 'Int',
  umsetzung: 'Int',
  bearbeiter: 'UUID',
  ekfBeobachtungszeitpunkt: 'String',
}

interface Options {
  adresses: Array<{ value: string; label: string }>
  apBearbstandWertes: Array<{ value: number; label: string }>
  apUmsetzungWertes: Array<{ value: number; label: string }>
}

interface HistoryRow {
  year: number
  bearbeitung: number | null
  startJahr: number | null
  umsetzung: number | null
  bearbeiter: string | null
  ekfBeobachtungszeitpunkt: string | null
}

interface Props {
  isNew: boolean
  artId: string | null
  historyRow?: HistoryRow
  options: Options
  onClose: () => void
  refetch: () => void
}

export const HistoryForm = ({
  isNew,
  artId,
  historyRow,
  options,
  onClose,
  refetch,
}: Props) => {
  const { apId, projId } = useParams<{ apId: string; projId: string }>()
  const userName = useAtomValue(userNameAtom)
  const apolloClient = useApolloClient()

  const [fields, setFields] = useState<Record<string, unknown>>({
    year: isNew ? '' : (historyRow?.year ?? ''),
    bearbeitung: historyRow?.bearbeitung ?? null,
    startJahr: historyRow?.startJahr ?? null,
    umsetzung: historyRow?.umsetzung ?? null,
    bearbeiter: historyRow?.bearbeiter ?? null,
    ekfBeobachtungszeitpunkt: historyRow?.ekfBeobachtungszeitpunkt ?? null,
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const containerRef = useRef<HTMLDivElement>(null)
  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  useEffect(() => {
    if (isNew) {
      const input =
        containerRef.current?.querySelector<HTMLInputElement>(
          'input[name="year"]',
        )
      input?.focus()
    }
  }, [])

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    if (isNew) {
      setFields((prev) => ({ ...prev, [field]: value }))
      return
    }

    // Existing row: mutate immediately
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation updateApHistoryForHistorienForm(
            $id: UUID!
            $year: Int!
            $${field}: ${fieldTypes[field]}
            $changedBy: String
          ) {
            updateApHistoryByIdAndYear(
              input: {
                id: $id
                year: $year
                apHistoryPatch: {
                  ${field}: $${field}
                  changedBy: $changedBy
                }
              }
            ) {
              apHistory {
                ...ApHistoryFields
              }
            }
          }
          ${apHistory}
        `,
        variables: {
          id: apId,
          year: historyRow!.year,
          [field]: value,
          changedBy: userName,
        },
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    refetch()
  }

  const handleSaveNew = async () => {
    if (!fields.year) return
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation createApHistoryForHistorienForm(
            $id: UUID!
            $year: Int!
            $artId: UUID
            $projId: UUID
            $bearbeitung: Int
            $startJahr: Int
            $umsetzung: Int
            $bearbeiter: UUID
            $ekfBeobachtungszeitpunkt: String
            $changedBy: String
          ) {
            createApHistory(
              input: {
                apHistory: {
                  id: $id
                  year: $year
                  artId: $artId
                  projId: $projId
                  bearbeitung: $bearbeitung
                  startJahr: $startJahr
                  umsetzung: $umsetzung
                  bearbeiter: $bearbeiter
                  ekfBeobachtungszeitpunkt: $ekfBeobachtungszeitpunkt
                  changedBy: $changedBy
                }
              }
            ) {
              apHistory {
                ...ApHistoryFields
              }
            }
          }
          ${apHistory}
        `,
        variables: {
          id: apId,
          year: Number(fields.year),
          artId,
          projId,
          bearbeitung: fields.bearbeitung,
          startJahr: fields.startJahr,
          umsetzung: fields.umsetzung,
          bearbeiter: fields.bearbeiter,
          ekfBeobachtungszeitpunkt: fields.ekfBeobachtungszeitpunkt,
          changedBy: userName,
        },
      })
    } catch (error) {
      console.error('Failed to create ap_history:', error)
      return
    }
    refetch()
  }

  const rowKey = historyRow?.year ?? 'new'

  const handleOk = async () => {
    if (isNew) await handleSaveNew()
    onClose()
  }

  const onClickDelete = async () => {
    setDelMenuAnchorEl(null)
    if (isNew) {
      onClose()
      return
    }
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation deleteApHistoryForHistorienForm($id: UUID!, $year: Int!) {
            deleteApHistoryByIdAndYear(input: { id: $id, year: $year }) {
              apHistory {
                id
                year
              }
            }
          }
        `,
        variables: { id: apId, year: historyRow!.year },
      })
    } catch (error) {
      console.error('Failed to delete ap_history:', error)
      return
    }
    refetch()
    onClose()
  }

  return (
    <div
      ref={containerRef}
      className={styles.container}
    >
      <div className={styles.header}>
        <Tooltip title="Löschen">
          <IconButton
            size="small"
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'apHistoryDelMenu' : undefined}
          >
            <FaMinus />
          </IconButton>
        </Tooltip>
        <Tooltip title="OK">
          <IconButton
            className={styles.okButton}
            size="small"
            onClick={handleOk}
          >
            <MdCheck />
          </IconButton>
        </Tooltip>
      </div>
      <MuiMenu
        id="apHistoryDelMenu"
        anchorEl={delMenuAnchorEl}
        open={delMenuOpen}
        onClose={() => setDelMenuAnchorEl(null)}
      >
        <h3 className={styles.menuTitle}>löschen?</h3>
        <MenuItem onClick={onClickDelete}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
      <TextField
        name="year"
        label="Jahr"
        type="number"
        value={fields.year}
        saveToDb={saveToDb}
        error={fieldErrors.year}
        disabled={!isNew}
      />
      <Select
        key={`${rowKey}bearbeitung`}
        name="bearbeitung"
        label="Aktionsplan"
        options={options.apBearbstandWertes}
        value={fields.bearbeitung}
        saveToDb={saveToDb}
        error={fieldErrors.bearbeitung}
      />
      <Select
        key={`${rowKey}umsetzung`}
        name="umsetzung"
        label="Stand Umsetzung"
        options={options.apUmsetzungWertes}
        value={fields.umsetzung}
        saveToDb={saveToDb}
        error={fieldErrors.umsetzung}
      />
      <Select
        key={`${rowKey}bearbeiter`}
        name="bearbeiter"
        label="Verantwortlich"
        options={options.adresses}
        value={fields.bearbeiter}
        saveToDb={saveToDb}
        error={fieldErrors.bearbeiter}
      />
      <TextField
        name="startJahr"
        label="Start im Jahr"
        type="number"
        value={fields.startJahr}
        saveToDb={saveToDb}
        error={fieldErrors.startJahr}
      />
      <TextField
        name="ekfBeobachtungszeitpunkt"
        label="Bester Beobachtungszeitpunkt für EKF"
        type="text"
        value={fields.ekfBeobachtungszeitpunkt}
        saveToDb={saveToDb}
        error={fieldErrors.ekfBeobachtungszeitpunkt}
      />
    </div>
  )
}
