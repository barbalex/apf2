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
import { Checkbox2States } from '../../../../shared/Checkbox2States.tsx'
import { ifIsNumericAsNumber } from '../../../../../modules/ifIsNumericAsNumber.ts'
import { userNameAtom } from '../../../../../store/index.ts'
import { popHistory } from '../../../../shared/fragments.ts'

import styles from './HistoryForm.module.css'

const fieldTypes: Record<string, string> = {
  year: 'Int',
  nr: 'Int',
  name: 'String',
  status: 'Int',
  statusUnklar: 'Boolean',
  statusUnklarBegruendung: 'String',
  bekanntSeit: 'Int',
  geomPoint: 'GeoJSON',
}

interface Options {
  popStatusWertes: Array<{ value: number; label: string }>
}

interface HistoryRow {
  year: number
  nr: number | null
  name: string | null
  status: number | null
  statusUnklar: boolean | null
  statusUnklarBegruendung: string | null
  bekanntSeit: number | null
  geomPoint?: { x: number | null; y: number | null } | null
}

interface Props {
  isNew: boolean
  historyRow?: HistoryRow
  options: Options
  onClose: () => void
  refetch: () => void
}

export const HistoryForm = ({
  isNew,
  historyRow,
  options,
  onClose,
  refetch,
}: Props) => {
  const { popId } = useParams<{ popId: string }>()
  const userName = useAtomValue(userNameAtom)
  const apolloClient = useApolloClient()

  const [fields, setFields] = useState<Record<string, unknown>>({
    year: isNew ? '' : (historyRow?.year ?? ''),
    nr: historyRow?.nr ?? null,
    name: historyRow?.name ?? null,
    status: historyRow?.status ?? null,
    statusUnklar: historyRow?.statusUnklar ?? null,
    statusUnklarBegruendung: historyRow?.statusUnklarBegruendung ?? null,
    bekanntSeit: historyRow?.bekanntSeit ?? null,
    x: historyRow?.geomPoint?.x ?? null,
    y: historyRow?.geomPoint?.y ?? null,
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isNew) {
      const input = containerRef.current?.querySelector<HTMLInputElement>(
        'input[name="year"]',
      )
      input?.focus()
    }
  }, [])

  const buildGeomPoint = (x: unknown, y: unknown) => {
    if (!x || !y) return null
    return {
      type: 'Point',
      coordinates: [Number(x), Number(y)],
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:EPSG::4326' },
      },
    }
  }

  const saveCoordToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name // 'x' or 'y'
    const value = ifIsNumericAsNumber(event.target.value)

    if (isNew) {
      setFields((prev) => ({ ...prev, [field]: value }))
      return
    }

    const newX = field === 'x' ? value : fields.x
    const newY = field === 'y' ? value : fields.y
    setFields((prev) => ({ ...prev, [field]: value }))
    const geomPoint = buildGeomPoint(newX, newY)
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation updatePopHistoryGeomForHistorienForm(
            $id: UUID!
            $year: Int!
            $geomPoint: GeoJSON
            $changedBy: String
          ) {
            updatePopHistoryByIdAndYear(
              input: {
                id: $id
                year: $year
                popHistoryPatch: {
                  geomPoint: $geomPoint
                  changedBy: $changedBy
                }
              }
            ) {
              popHistory {
                ...PopHistoryFields
              }
            }
          }
          ${popHistory}
        `,
        variables: {
          id: popId,
          year: historyRow!.year,
          geomPoint,
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
      const { x: _x, y: _y, ...rest } = prev
      return rest
    })
    refetch()
  }

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const rawValue = event.target.value
    const value =
      typeof rawValue === 'boolean' ? rawValue : ifIsNumericAsNumber(rawValue)

    // Always update local state immediately for responsive UI
    setFields((prev) => ({ ...prev, [field]: value }))

    if (isNew) return

    // Existing row: mutate immediately
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation updatePopHistoryForHistorienForm(
            $id: UUID!
            $year: Int!
            $${field}: ${fieldTypes[field]}
            $changedBy: String
          ) {
            updatePopHistoryByIdAndYear(
              input: {
                id: $id
                year: $year
                popHistoryPatch: {
                  ${field}: $${field}
                  changedBy: $changedBy
                }
              }
            ) {
              popHistory {
                ...PopHistoryFields
              }
            }
          }
          ${popHistory}
        `,
        variables: {
          id: popId,
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
          mutation createPopHistoryForHistorienForm(
            $id: UUID!
            $year: Int!
            $nr: Int
            $name: String
            $status: Int
            $statusUnklar: Boolean
            $statusUnklarBegruendung: String
            $bekanntSeit: Int
            $geomPoint: GeoJSON
            $changedBy: String
          ) {
            createPopHistory(
              input: {
                popHistory: {
                  id: $id
                  year: $year
                  nr: $nr
                  name: $name
                  status: $status
                  statusUnklar: $statusUnklar
                  statusUnklarBegruendung: $statusUnklarBegruendung
                  bekanntSeit: $bekanntSeit
                  geomPoint: $geomPoint
                  changedBy: $changedBy
                }
              }
            ) {
              popHistory {
                ...PopHistoryFields
              }
            }
          }
          ${popHistory}
        `,
        variables: {
          id: popId,
          year: Number(fields.year),
          nr: fields.nr,
          name: fields.name,
          status: fields.status,
          statusUnklar: fields.statusUnklar,
          statusUnklarBegruendung: fields.statusUnklarBegruendung,
          bekanntSeit: fields.bekanntSeit,
          geomPoint: buildGeomPoint(fields.x, fields.y),
          changedBy: userName,
        },
      })
    } catch (error) {
      console.error('Failed to create pop_history:', error)
      return
    }
    refetch()
  }

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
          mutation deletePopHistoryForHistorienForm($id: UUID!, $year: Int!) {
            deletePopHistoryByIdAndYear(input: { id: $id, year: $year }) {
              popHistory {
                id
                year
              }
            }
          }
        `,
        variables: { id: popId, year: historyRow!.year },
      })
    } catch (error) {
      console.error('Failed to delete pop_history:', error)
      return
    }
    refetch()
    onClose()
  }

  const rowKey = historyRow?.year ?? 'new'

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
            aria-owns={delMenuOpen ? 'popHistoryDelMenu' : undefined}
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
        id="popHistoryDelMenu"
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
      <TextField
        name="nr"
        label="Nr."
        type="number"
        value={fields.nr}
        saveToDb={saveToDb}
        error={fieldErrors.nr}
      />
      <TextField
        name="name"
        label="Name"
        type="text"
        value={fields.name}
        saveToDb={saveToDb}
        error={fieldErrors.name}
      />
      <TextField
        name="bekanntSeit"
        label="bekannt seit"
        type="number"
        value={fields.bekanntSeit}
        saveToDb={saveToDb}
        error={fieldErrors.bekanntSeit}
      />
      <Select
        key={`${rowKey}status`}
        name="status"
        label="Status"
        options={options.popStatusWertes}
        value={fields.status}
        saveToDb={saveToDb}
        error={fieldErrors.status}
      />
      <Checkbox2States
        name="statusUnklar"
        label="Status unklar"
        value={fields.statusUnklar}
        saveToDb={saveToDb}
        error={fieldErrors.statusUnklar}
      />
      <TextField
        name="statusUnklarBegruendung"
        label="Begründung (für Status unklar)"
        type="text"
        multiLine
        value={fields.statusUnklarBegruendung}
        saveToDb={saveToDb}
        error={fieldErrors.statusUnklarBegruendung}
      />
      <TextField
        name="x"
        label="Längengrad"
        type="number"
        value={fields.x}
        saveToDb={saveCoordToDb}
        error={fieldErrors.x}
      />
      <TextField
        name="y"
        label="Breitengrad"
        type="number"
        value={fields.y}
        saveToDb={saveCoordToDb}
        error={fieldErrors.y}
      />
    </div>
  )
}
