import type { SaveToDbEvent } from '../../../../shared/types.ts'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'
import { Tooltip, IconButton, Menu as MuiMenu, MenuItem } from '@mui/material'
import { MdCheck } from 'react-icons/md'
import { FaMinus } from 'react-icons/fa'

import { TextField } from '../../../../shared/TextField.tsx'
import { Select } from '../../../../shared/Select.tsx'
import { Checkbox2States } from '../../../../shared/Checkbox2States.tsx'
import { ifIsNumericAsNumber } from '../../../../../modules/ifIsNumericAsNumber.ts'
import { apiFetch, apiInsert } from '../../../../../modules/api.ts'
import { camelToSnake } from '../../../../../modules/camelToSnake.ts'
import { userNameAtom } from '../../../../../store/index.ts'

import styles from './HistoryForm.module.css'

interface Options {
  popStatusWertes: { value: number; label: string }[]
}

interface HistoryRow {
  year?: number | null | undefined
  nr: number | null
  name: string | null
  status: number | null
  statusUnklar: boolean | null
  statusUnklarBegruendung: string | null
  bekanntSeit: number | null
  geomPoint?: { type: string; coordinates: [number, number] } | null | undefined
}

interface Props {
  isNew: boolean
  historyRow?: HistoryRow | undefined
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

  const [fields, setFields] = useState<Record<string, unknown>>({
    year: isNew ? '' : (historyRow?.year ?? ''),
    nr: historyRow?.nr ?? null,
    name: historyRow?.name ?? null,
    status: historyRow?.status ?? null,
    statusUnklar: historyRow?.statusUnklar ?? null,
    statusUnklarBegruendung: historyRow?.statusUnklarBegruendung ?? null,
    bekanntSeit: historyRow?.bekanntSeit ?? null,
    x: historyRow?.geomPoint?.coordinates?.[0] ?? null,
    y: historyRow?.geomPoint?.coordinates?.[1] ?? null,
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isNew) {
      const input =
        containerRef.current?.querySelector<HTMLInputElement>(
          'input[name="year"]',
        )
      input?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only focus on mount, isNew does not change
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

  const saveCoordToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name as 'x' | 'y' // 'x' or 'y'
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
      await apiFetch(
        `/pop_history?id=eq.${popId}&year=eq.${historyRow?.year}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            geom_point: geomPoint,
            changed_by: userName,
          }),
        },
      )
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

  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name as string
    const rawValue = event.target.value
    const value =
      typeof rawValue === 'boolean' ? rawValue : ifIsNumericAsNumber(rawValue)

    // Always update local state immediately for responsive UI
    setFields((prev) => ({ ...prev, [field]: value }))

    if (isNew) return

    // Existing row: mutate immediately
    try {
      await apiFetch(
        `/pop_history?id=eq.${popId}&year=eq.${historyRow?.year}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            [camelToSnake(field)]: value,
            changed_by: userName,
          }),
        },
      )
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
      await apiInsert('pop_history', {
        id: popId,
        year: Number(fields.year),
        nr: fields.nr,
        name: fields.name,
        status: fields.status,
        status_unklar: fields.statusUnklar,
        status_unklar_begruendung: fields.statusUnklarBegruendung,
        bekannt_seit: fields.bekanntSeit,
        geom_point: buildGeomPoint(fields.x, fields.y),
        changed_by: userName,
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
      await apiFetch(
        `/pop_history?id=eq.${popId}&year=eq.${historyRow?.year}`,
        {
          method: 'DELETE',
        },
      )
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
            onClick={() => void handleOk()}
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
        <MenuItem onClick={() => void onClickDelete()}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
      <TextField
        name="year"
        label="Jahr"
        type="number"
        value={fields.year as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.year}
        disabled={!isNew}
      />
      <TextField
        name="nr"
        label="Nr."
        type="number"
        value={fields.nr as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.nr}
      />
      <TextField
        name="name"
        label="Name"
        type="text"
        value={fields.name as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.name}
      />
      <TextField
        name="bekanntSeit"
        label="bekannt seit"
        type="number"
        value={fields.bekanntSeit as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.bekanntSeit}
      />
      <Select
        key={`${rowKey}status`}
        name="status"
        label="Status"
        options={options.popStatusWertes}
        value={fields.status as number | null}
        saveToDb={(fakeEvent) => void saveToDb(fakeEvent)}
        error={fieldErrors.status ?? ''}
      />
      <Checkbox2States
        name="statusUnklar"
        label="Status unklar"
        value={fields.statusUnklar as boolean | null}
        saveToDb={saveToDb}
        error={fieldErrors.statusUnklar}
        helperText=""
      />
      <TextField
        name="statusUnklarBegruendung"
        label="Begründung (für Status unklar)"
        type="text"
        multiLine
        value={fields.statusUnklarBegruendung as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.statusUnklarBegruendung}
      />
      <TextField
        name="x"
        label="Längengrad"
        type="number"
        value={fields.x as string | number | null}
        saveToDb={saveCoordToDb}
        error={fieldErrors.x}
      />
      <TextField
        name="y"
        label="Breitengrad"
        type="number"
        value={fields.y as string | number | null}
        saveToDb={saveCoordToDb}
        error={fieldErrors.y}
      />
    </div>
  )
}
