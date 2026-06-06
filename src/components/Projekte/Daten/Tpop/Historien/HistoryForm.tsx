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
import { tpopHistory } from '../../../../shared/fragments.ts'

import styles from './HistoryForm.module.css'

const fieldTypes: Record<string, string> = {
  year: 'Int',
  nr: 'Int',
  flurname: 'String',
  bekanntSeit: 'Int',
  status: 'Int',
  statusUnklar: 'Boolean',
  statusUnklarGrund: 'String',
  apberRelevant: 'Boolean',
  apberRelevantGrund: 'Int',
  gemeinde: 'String',
  radius: 'Int',
  hoehe: 'Int',
  exposition: 'String',
  klima: 'String',
  neigung: 'String',
  beschreibung: 'String',
  katasterNr: 'String',
  eigentuemer: 'String',
  kontakt: 'String',
  nutzungszone: 'String',
  bewirtschafter: 'String',
  bewirtschaftung: 'String',
  bemerkungen: 'String',
  ekfrequenz: 'UUID',
  ekfrequenzAbweichend: 'Boolean',
  ekfrequenzStartjahr: 'Int',
  ekfKontrolleur: 'UUID',
  geomPoint: 'GeoJSON',
}

interface Options {
  popStatusWertes: Array<{ value: number; label: string }>
  apberRelevantGrundWertes: Array<{ value: number; label: string }>
  adresses: Array<{ value: string; label: string }>
  ekfrequenzs: Array<{ value: string; label: string }>
}

interface HistoryRow {
  year: number
  nr: number | null
  flurname: string | null
  bekanntSeit: number | null
  status: number | null
  statusUnklar: boolean | null
  statusUnklarGrund: string | null
  apberRelevant: boolean | null
  apberRelevantGrund: number | null
  gemeinde: string | null
  radius: number | null
  hoehe: number | null
  exposition: string | null
  klima: string | null
  neigung: string | null
  beschreibung: string | null
  katasterNr: string | null
  eigentuemer: string | null
  kontakt: string | null
  nutzungszone: string | null
  bewirtschafter: string | null
  bewirtschaftung: string | null
  bemerkungen: string | null
  ekfrequenz: string | null
  ekfrequenzAbweichend: boolean | null
  ekfrequenzStartjahr: number | null
  ekfKontrolleur: string | null
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
  const { tpopId } = useParams<{ tpopId: string }>()
  const userName = useAtomValue(userNameAtom)
  const apolloClient = useApolloClient()

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

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const rawValue = event.target.value
    const value =
      typeof rawValue === 'boolean' ? rawValue : ifIsNumericAsNumber(rawValue)

    setFields((prev) => ({ ...prev, [field]: value }))
    if (isNew) return

    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation updateTpopHistoryForHistorienForm(
            $id: UUID!
            $year: Int!
            $${field}: ${fieldTypes[field]}
            $changedBy: String
          ) {
            updateTpopHistoryByIdAndYear(
              input: {
                id: $id
                year: $year
                tpopHistoryPatch: {
                  ${field}: $${field}
                  changedBy: $changedBy
                }
              }
            ) {
              tpopHistory {
                ...TpopHistoryFields
              }
            }
          }
          ${tpopHistory}
        `,
        variables: {
          id: tpopId,
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

  const saveCoordToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)
    const newX = field === 'x' ? value : fields.x
    const newY = field === 'y' ? value : fields.y
    setFields((prev) => ({ ...prev, [field]: value }))
    if (isNew) return

    const geomPoint = buildGeomPoint(newX, newY)
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation updateTpopHistoryGeomForHistorienForm(
            $id: UUID!
            $year: Int!
            $geomPoint: GeoJSON
            $changedBy: String
          ) {
            updateTpopHistoryByIdAndYear(
              input: {
                id: $id
                year: $year
                tpopHistoryPatch: {
                  geomPoint: $geomPoint
                  changedBy: $changedBy
                }
              }
            ) {
              tpopHistory {
                ...TpopHistoryFields
              }
            }
          }
          ${tpopHistory}
        `,
        variables: {
          id: tpopId,
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

  const handleSaveNew = async () => {
    if (!fields.year) return
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation createTpopHistoryForHistorienForm(
            $id: UUID!
            $year: Int!
            $nr: Int
            $flurname: String
            $bekanntSeit: Int
            $status: Int
            $statusUnklar: Boolean
            $statusUnklarGrund: String
            $apberRelevant: Boolean
            $apberRelevantGrund: Int
            $gemeinde: String
            $radius: Int
            $hoehe: Int
            $exposition: String
            $klima: String
            $neigung: String
            $beschreibung: String
            $katasterNr: String
            $eigentuemer: String
            $kontakt: String
            $nutzungszone: String
            $bewirtschafter: String
            $bewirtschaftung: String
            $bemerkungen: String
            $ekfrequenz: UUID
            $ekfrequenzAbweichend: Boolean
            $ekfrequenzStartjahr: Int
            $ekfKontrolleur: UUID
            $geomPoint: GeoJSON
            $changedBy: String
          ) {
            createTpopHistory(
              input: {
                tpopHistory: {
                  id: $id
                  year: $year
                  nr: $nr
                  flurname: $flurname
                  bekanntSeit: $bekanntSeit
                  status: $status
                  statusUnklar: $statusUnklar
                  statusUnklarGrund: $statusUnklarGrund
                  apberRelevant: $apberRelevant
                  apberRelevantGrund: $apberRelevantGrund
                  gemeinde: $gemeinde
                  radius: $radius
                  hoehe: $hoehe
                  exposition: $exposition
                  klima: $klima
                  neigung: $neigung
                  beschreibung: $beschreibung
                  katasterNr: $katasterNr
                  eigentuemer: $eigentuemer
                  kontakt: $kontakt
                  nutzungszone: $nutzungszone
                  bewirtschafter: $bewirtschafter
                  bewirtschaftung: $bewirtschaftung
                  bemerkungen: $bemerkungen
                  ekfrequenz: $ekfrequenz
                  ekfrequenzAbweichend: $ekfrequenzAbweichend
                  ekfrequenzStartjahr: $ekfrequenzStartjahr
                  ekfKontrolleur: $ekfKontrolleur
                  geomPoint: $geomPoint
                  changedBy: $changedBy
                }
              }
            ) {
              tpopHistory {
                ...TpopHistoryFields
              }
            }
          }
          ${tpopHistory}
        `,
        variables: {
          id: tpopId,
          year: Number(fields.year),
          nr: fields.nr,
          flurname: fields.flurname,
          bekanntSeit: fields.bekanntSeit,
          status: fields.status,
          statusUnklar: fields.statusUnklar,
          statusUnklarGrund: fields.statusUnklarGrund,
          apberRelevant: fields.apberRelevant,
          apberRelevantGrund: fields.apberRelevantGrund,
          gemeinde: fields.gemeinde,
          radius: fields.radius,
          hoehe: fields.hoehe,
          exposition: fields.exposition,
          klima: fields.klima,
          neigung: fields.neigung,
          beschreibung: fields.beschreibung,
          katasterNr: fields.katasterNr,
          eigentuemer: fields.eigentuemer,
          kontakt: fields.kontakt,
          nutzungszone: fields.nutzungszone,
          bewirtschafter: fields.bewirtschafter,
          bewirtschaftung: fields.bewirtschaftung,
          bemerkungen: fields.bemerkungen,
          ekfrequenz: fields.ekfrequenz,
          ekfrequenzAbweichend: fields.ekfrequenzAbweichend,
          ekfrequenzStartjahr: fields.ekfrequenzStartjahr,
          ekfKontrolleur: fields.ekfKontrolleur,
          geomPoint: buildGeomPoint(fields.x, fields.y),
          changedBy: userName,
        },
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
      await apolloClient.mutate({
        mutation: gql`
          mutation deleteTpopHistoryForHistorienForm($id: UUID!, $year: Int!) {
            deleteTpopHistoryByIdAndYear(input: { id: $id, year: $year }) {
              tpopHistory {
                id
                year
              }
            }
          }
        `,
        variables: { id: tpopId, year: historyRow!.year },
      })
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
            onClick={handleOk}
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
        name="flurname"
        label="Flurname"
        type="text"
        value={fields.flurname}
        saveToDb={saveToDb}
        error={fieldErrors.flurname}
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
        name="statusUnklarGrund"
        label="Begründung (für Status unklar)"
        type="text"
        multiLine
        value={fields.statusUnklarGrund}
        saveToDb={saveToDb}
        error={fieldErrors.statusUnklarGrund}
      />
      <Checkbox2States
        name="apberRelevant"
        label="Für AP-Bericht relevant"
        value={fields.apberRelevant}
        saveToDb={saveToDb}
        error={fieldErrors.apberRelevant}
      />
      <Select
        key={`${rowKey}apberRelevantGrund`}
        name="apberRelevantGrund"
        label="Grund für AP-Bericht (Nicht-)Relevanz"
        options={options.apberRelevantGrundWertes}
        value={fields.apberRelevantGrund}
        saveToDb={saveToDb}
        error={fieldErrors.apberRelevantGrund}
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
      <TextField
        name="gemeinde"
        label="Gemeinde"
        type="text"
        value={fields.gemeinde}
        saveToDb={saveToDb}
        error={fieldErrors.gemeinde}
      />
      <TextField
        name="radius"
        label="Radius (m)"
        type="number"
        value={fields.radius}
        saveToDb={saveToDb}
        error={fieldErrors.radius}
      />
      <TextField
        name="hoehe"
        label="Höhe (m.ü.M.)"
        type="number"
        value={fields.hoehe}
        saveToDb={saveToDb}
        error={fieldErrors.hoehe}
      />
      <TextField
        name="exposition"
        label="Exposition, Besonnung"
        type="text"
        value={fields.exposition}
        saveToDb={saveToDb}
        error={fieldErrors.exposition}
      />
      <TextField
        name="klima"
        label="Klima"
        type="text"
        value={fields.klima}
        saveToDb={saveToDb}
        error={fieldErrors.klima}
      />
      <TextField
        name="neigung"
        label="Hangneigung"
        type="text"
        value={fields.neigung}
        saveToDb={saveToDb}
        error={fieldErrors.neigung}
      />
      <TextField
        name="beschreibung"
        label="Beschreibung"
        type="text"
        multiLine
        value={fields.beschreibung}
        saveToDb={saveToDb}
        error={fieldErrors.beschreibung}
      />
      <TextField
        name="katasterNr"
        label="Kataster-Nr."
        type="text"
        value={fields.katasterNr}
        saveToDb={saveToDb}
        error={fieldErrors.katasterNr}
      />
      <TextField
        name="eigentuemer"
        label="EigentümerIn"
        type="text"
        value={fields.eigentuemer}
        saveToDb={saveToDb}
        error={fieldErrors.eigentuemer}
      />
      <TextField
        name="kontakt"
        label="Kontakt vor Ort"
        type="text"
        value={fields.kontakt}
        saveToDb={saveToDb}
        error={fieldErrors.kontakt}
      />
      <TextField
        name="nutzungszone"
        label="Nutzungszone"
        type="text"
        value={fields.nutzungszone}
        saveToDb={saveToDb}
        error={fieldErrors.nutzungszone}
      />
      <TextField
        name="bewirtschafter"
        label="BewirtschafterIn"
        type="text"
        value={fields.bewirtschafter}
        saveToDb={saveToDb}
        error={fieldErrors.bewirtschafter}
      />
      <TextField
        name="bewirtschaftung"
        label="Bewirtschaftung"
        type="text"
        value={fields.bewirtschaftung}
        saveToDb={saveToDb}
        error={fieldErrors.bewirtschaftung}
      />
      <TextField
        name="bemerkungen"
        label="Bemerkungen"
        type="text"
        multiLine
        value={fields.bemerkungen}
        saveToDb={saveToDb}
        error={fieldErrors.bemerkungen}
      />
      <Select
        key={`${rowKey}ekfrequenz`}
        name="ekfrequenz"
        label="EK-Frequenz"
        options={options.ekfrequenzs}
        value={fields.ekfrequenz}
        saveToDb={saveToDb}
        error={fieldErrors.ekfrequenz}
      />
      <Checkbox2States
        name="ekfrequenzAbweichend"
        label="EK-Frequenz abweichend"
        value={fields.ekfrequenzAbweichend}
        saveToDb={saveToDb}
        error={fieldErrors.ekfrequenzAbweichend}
      />
      <TextField
        name="ekfrequenzStartjahr"
        label="EK-Frequenz Startjahr"
        type="number"
        value={fields.ekfrequenzStartjahr}
        saveToDb={saveToDb}
        error={fieldErrors.ekfrequenzStartjahr}
      />
      <Select
        key={`${rowKey}ekfKontrolleur`}
        name="ekfKontrolleur"
        label="EKF-KontrolleurIn"
        options={options.adresses}
        value={fields.ekfKontrolleur}
        saveToDb={saveToDb}
        error={fieldErrors.ekfKontrolleur}
      />
    </div>
  )
}
