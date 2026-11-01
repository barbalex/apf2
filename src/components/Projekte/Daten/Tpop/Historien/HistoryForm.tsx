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
  apberRelevantGrundWertes: { value: number; label: string }[]
  adresses: { value: string; label: string }[]
  ekfrequenzs: { value: string; label: string }[]
}

interface HistoryRow {
  year?: number | null
  nr?: number | null
  flurname?: string | null
  bekanntSeit?: number | null
  status?: number | null
  statusUnklar?: boolean | null
  statusUnklarGrund?: string | null
  apberRelevant?: boolean | null
  apberRelevantGrund?: number | null
  gemeinde?: string | null
  radius?: number | null
  hoehe?: number | null
  exposition?: string | null
  klima?: string | null
  neigung?: string | null
  beschreibung?: string | null
  katasterNr?: string | null
  eigentuemer?: string | null
  kontakt?: string | null
  nutzungszone?: string | null
  bewirtschafter?: string | null
  bewirtschaftung?: string | null
  bemerkungen?: string | null
  ekfrequenz?: string | null
  ekfrequenzAbweichend?: boolean | null
  ekfrequenzStartjahr?: number | null
  ekfKontrolleur?: string | null
  geomPoint?: { x?: number | null; y?: number | null } | null
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
  const { tpopId } = useParams<{ tpopId: string }>()
  const userName = useAtomValue(userNameAtom)

  const [fields, setFields] = useState<Record<string, unknown>>({
    year: isNew ? '' : (historyRow?.year ?? ''),
    nr: historyRow?.nr ?? null,
    flurname: historyRow?.flurname ?? null,
    bekanntSeit: historyRow?.bekanntSeit ?? null,
    status: historyRow?.status ?? null,
    statusUnklar: historyRow?.statusUnklar ?? null,
    statusUnklarGrund: historyRow?.statusUnklarGrund ?? null,
    apberRelevant: historyRow?.apberRelevant ?? null,
    apberRelevantGrund: historyRow?.apberRelevantGrund ?? null,
    gemeinde: historyRow?.gemeinde ?? null,
    radius: historyRow?.radius ?? null,
    hoehe: historyRow?.hoehe ?? null,
    exposition: historyRow?.exposition ?? null,
    klima: historyRow?.klima ?? null,
    neigung: historyRow?.neigung ?? null,
    beschreibung: historyRow?.beschreibung ?? null,
    katasterNr: historyRow?.katasterNr ?? null,
    eigentuemer: historyRow?.eigentuemer ?? null,
    kontakt: historyRow?.kontakt ?? null,
    nutzungszone: historyRow?.nutzungszone ?? null,
    bewirtschafter: historyRow?.bewirtschafter ?? null,
    bewirtschaftung: historyRow?.bewirtschaftung ?? null,
    bemerkungen: historyRow?.bemerkungen ?? null,
    ekfrequenz: historyRow?.ekfrequenz ?? null,
    ekfrequenzAbweichend: historyRow?.ekfrequenzAbweichend ?? null,
    ekfrequenzStartjahr: historyRow?.ekfrequenzStartjahr ?? null,
    ekfKontrolleur: historyRow?.ekfKontrolleur ?? null,
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
      const input =
        containerRef.current?.querySelector<HTMLInputElement>(
          'input[name="year"]',
        )
      input?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name ?? ''
    const rawValue = event.target.value
    const value =
      typeof rawValue === 'boolean' ? rawValue : ifIsNumericAsNumber(rawValue)

    setFields((prev) => ({ ...prev, [field]: value }))
    if (isNew) return

    try {
      await apiFetch(
        `/tpop_history?id=eq.${tpopId}&year=eq.${historyRow?.year}`,
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

  const saveCoordToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name
    if (!field) return
    const value = ifIsNumericAsNumber(event.target.value)
    const newX = field === 'x' ? value : fields.x
    const newY = field === 'y' ? value : fields.y
    setFields((prev) => ({ ...prev, [field]: value }))
    if (isNew) return

    const geomPoint = buildGeomPoint(newX, newY)
    try {
      await apiFetch(
        `/tpop_history?id=eq.${tpopId}&year=eq.${historyRow?.year}`,
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

  const handleSaveNew = async () => {
    if (!fields.year) return
    try {
      await apiInsert('tpop_history', {
        id: tpopId,
        year: Number(fields.year),
        nr: fields.nr,
        flurname: fields.flurname,
        bekannt_seit: fields.bekanntSeit,
        status: fields.status,
        status_unklar: fields.statusUnklar,
        status_unklar_grund: fields.statusUnklarGrund,
        apber_relevant: fields.apberRelevant,
        apber_relevant_grund: fields.apberRelevantGrund,
        gemeinde: fields.gemeinde,
        radius: fields.radius,
        hoehe: fields.hoehe,
        exposition: fields.exposition,
        klima: fields.klima,
        neigung: fields.neigung,
        beschreibung: fields.beschreibung,
        kataster_nr: fields.katasterNr,
        eigentuemer: fields.eigentuemer,
        kontakt: fields.kontakt,
        nutzungszone: fields.nutzungszone,
        bewirtschafter: fields.bewirtschafter,
        bewirtschaftung: fields.bewirtschaftung,
        bemerkungen: fields.bemerkungen,
        ekfrequenz: fields.ekfrequenz,
        ekfrequenz_abweichend: fields.ekfrequenzAbweichend,
        ekfrequenz_startjahr: fields.ekfrequenzStartjahr,
        ekf_kontrolleur: fields.ekfKontrolleur,
        geom_point: buildGeomPoint(fields.x, fields.y),
        changed_by: userName,
      })
    } catch (error) {
      console.error('Failed to create tpop_history:', error)
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
        `/tpop_history?id=eq.${tpopId}&year=eq.${historyRow?.year}`,
        {
          method: 'DELETE',
        },
      )
    } catch (error) {
      console.error('Failed to delete tpop_history:', error)
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
            aria-owns={delMenuOpen ? 'tpopHistoryDelMenu' : undefined}
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
        id="tpopHistoryDelMenu"
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
        name="flurname"
        label="Flurname"
        type="text"
        value={fields.flurname as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.flurname}
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
        value={fields.status as string | number | null}
        saveToDb={(e) => void saveToDb(e)}
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
        name="statusUnklarGrund"
        label="Begründung (für Status unklar)"
        type="text"
        multiLine
        value={fields.statusUnklarGrund as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.statusUnklarGrund}
      />
      <Checkbox2States
        name="apberRelevant"
        label="Für AP-Bericht relevant"
        value={fields.apberRelevant as boolean | null}
        saveToDb={saveToDb}
        error={fieldErrors.apberRelevant}
        helperText=""
      />
      <Select
        key={`${rowKey}apberRelevantGrund`}
        name="apberRelevantGrund"
        label="Grund für AP-Bericht (Nicht-)Relevanz"
        options={options.apberRelevantGrundWertes}
        value={fields.apberRelevantGrund as string | number | null}
        saveToDb={(e) => void saveToDb(e)}
        error={fieldErrors.apberRelevantGrund ?? ''}
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
      <TextField
        name="gemeinde"
        label="Gemeinde"
        type="text"
        value={fields.gemeinde as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.gemeinde}
      />
      <TextField
        name="radius"
        label="Radius (m)"
        type="number"
        value={fields.radius as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.radius}
      />
      <TextField
        name="hoehe"
        label="Höhe (m.ü.M.)"
        type="number"
        value={fields.hoehe as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.hoehe}
      />
      <TextField
        name="exposition"
        label="Exposition, Besonnung"
        type="text"
        value={fields.exposition as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.exposition}
      />
      <TextField
        name="klima"
        label="Klima"
        type="text"
        value={fields.klima as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.klima}
      />
      <TextField
        name="neigung"
        label="Hangneigung"
        type="text"
        value={fields.neigung as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.neigung}
      />
      <TextField
        name="beschreibung"
        label="Beschreibung"
        type="text"
        multiLine
        value={fields.beschreibung as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.beschreibung}
      />
      <TextField
        name="katasterNr"
        label="Kataster-Nr."
        type="text"
        value={fields.katasterNr as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.katasterNr}
      />
      <TextField
        name="eigentuemer"
        label="EigentümerIn"
        type="text"
        value={fields.eigentuemer as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.eigentuemer}
      />
      <TextField
        name="kontakt"
        label="Kontakt vor Ort"
        type="text"
        value={fields.kontakt as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.kontakt}
      />
      <TextField
        name="nutzungszone"
        label="Nutzungszone"
        type="text"
        value={fields.nutzungszone as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.nutzungszone}
      />
      <TextField
        name="bewirtschafter"
        label="BewirtschafterIn"
        type="text"
        value={fields.bewirtschafter as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.bewirtschafter}
      />
      <TextField
        name="bewirtschaftung"
        label="Bewirtschaftung"
        type="text"
        value={fields.bewirtschaftung as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.bewirtschaftung}
      />
      <TextField
        name="bemerkungen"
        label="Bemerkungen"
        type="text"
        multiLine
        value={fields.bemerkungen as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.bemerkungen}
      />
      <Select
        key={`${rowKey}ekfrequenz`}
        name="ekfrequenz"
        label="EK-Frequenz"
        options={options.ekfrequenzs}
        value={fields.ekfrequenz as string | number | null}
        saveToDb={(e) => void saveToDb(e)}
        error={fieldErrors.ekfrequenz ?? ''}
      />
      <Checkbox2States
        name="ekfrequenzAbweichend"
        label="EK-Frequenz abweichend"
        value={fields.ekfrequenzAbweichend as boolean | null}
        saveToDb={saveToDb}
        error={fieldErrors.ekfrequenzAbweichend}
        helperText=""
      />
      <TextField
        name="ekfrequenzStartjahr"
        label="EK-Frequenz Startjahr"
        type="number"
        value={fields.ekfrequenzStartjahr as string | number | null}
        saveToDb={saveToDb}
        error={fieldErrors.ekfrequenzStartjahr}
      />
      <Select
        key={`${rowKey}ekfKontrolleur`}
        name="ekfKontrolleur"
        label="EKF-KontrolleurIn"
        options={options.adresses}
        value={fields.ekfKontrolleur as string | number | null}
        saveToDb={(e) => void saveToDb(e)}
        error={fieldErrors.ekfKontrolleur ?? ''}
      />
    </div>
  )
}
