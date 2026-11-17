// the EkPlan plan state (selected aps, filters, shown columns and
// toggles — everything that makes a plan reproducible) is kept in the
// url as a single ?ekplan= param: base64url of a sparse json that only
// carries values differing from the defaults. Volatile state (hover,
// menus, data cache) never travels. Types survive the round trip
// because the value travels as json
import { bytesToB64url, b64urlToBytes } from './base64url.ts'
import {
  ekPlanDefaultFields,
  ekPlanDefaultStatusFilter,
} from '../store/ekplan.ts'

export const ekPlanParamName = 'ekplan'

export interface EkPlanAps {
  value: string
  label: string
}

// the full, typed state of every url-relevant ekplan atom
export interface EkPlanUrlState {
  aps: EkPlanAps[]
  fields: string[]
  pastYears: number
  showEk: boolean
  showEkf: boolean
  showCount: boolean
  showEkCount: boolean
  showMassn: boolean
  filters: {
    ap: string | null
    popNr: number | null
    popName: string | null
    popStatus: number[]
    nr: number | null
    gemeinde: string | null
    flurname: string | null
    status: number[]
    bekanntSeit: number | null
    lv95X: number | null
    lv95Y: number | null
    ekfKontrolleur: string | null
    ekAbrechnungstyp: string | null
    ekfrequenz: string | null
    ekfrequenzStartjahr: number | null
    ekfrequenzAbweichend: boolean
    ekfrequenzEmpty: boolean
    ekfrequenzStartjahrEmpty: boolean
    ansiedlungYear: number | null
    kontrolleYear: number | null
    ekplanYear: number | null
  }
}

export const defaultEkPlanUrlState: EkPlanUrlState = {
  aps: [],
  fields: ekPlanDefaultFields,
  pastYears: 5,
  showEk: true,
  showEkf: true,
  showCount: true,
  showEkCount: true,
  showMassn: true,
  filters: {
    ap: null,
    popNr: null,
    popName: null,
    popStatus: ekPlanDefaultStatusFilter,
    nr: null,
    gemeinde: null,
    flurname: null,
    status: ekPlanDefaultStatusFilter,
    bekanntSeit: null,
    lv95X: null,
    lv95Y: null,
    ekfKontrolleur: null,
    ekAbrechnungstyp: null,
    ekfrequenz: null,
    ekfrequenzStartjahr: null,
    ekfrequenzAbweichend: false,
    ekfrequenzEmpty: false,
    ekfrequenzStartjahrEmpty: false,
    ansiedlungYear: null,
    kontrolleYear: null,
    ekplanYear: null,
  },
}

// only values differing from the defaults travel
export const buildSparseEkPlanState = (
  state: EkPlanUrlState,
): Record<string, unknown> => {
  const sparse: Record<string, unknown> = {}
  if (state.aps.length > 0) sparse.aps = state.aps
  if (state.fields.join() !== ekPlanDefaultFields.join()) {
    sparse.fields = state.fields
  }
  if (state.pastYears !== defaultEkPlanUrlState.pastYears) {
    sparse.pastYears = state.pastYears
  }
  for (const key of [
    'showEk',
    'showEkf',
    'showCount',
    'showEkCount',
    'showMassn',
  ] as const) {
    if (!state[key]) sparse[key] = false
  }
  const sparseFilters: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(state.filters)) {
    const defaultValue =
      defaultEkPlanUrlState.filters[key as keyof EkPlanUrlState['filters']]
    if (Array.isArray(value) || Array.isArray(defaultValue)) {
      const v = Array.isArray(value) ? value : []
      const d = Array.isArray(defaultValue) ? defaultValue : []
      if (v.join() !== d.join()) sparseFilters[key] = value
    } else if (value !== defaultValue) {
      sparseFilters[key] = value
    }
  }
  if (Object.keys(sparseFilters).length > 0) sparse.filters = sparseFilters
  return sparse
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

// expected shape per filter key — null defaults cannot tell number
// fields from string fields, so the types are declared explicitly
const filterValueTypes = {
  ap: 'string',
  popNr: 'number',
  popName: 'string',
  popStatus: 'number[]',
  nr: 'number',
  gemeinde: 'string',
  flurname: 'string',
  status: 'number[]',
  bekanntSeit: 'number',
  lv95X: 'number',
  lv95Y: 'number',
  ekfKontrolleur: 'string',
  ekAbrechnungstyp: 'string',
  ekfrequenz: 'string',
  ekfrequenzStartjahr: 'number',
  ekfrequenzAbweichend: 'boolean',
  ekfrequenzEmpty: 'boolean',
  ekfrequenzStartjahrEmpty: 'boolean',
  ansiedlungYear: 'number',
  kontrolleYear: 'number',
  ekplanYear: 'number',
} as const satisfies Record<keyof EkPlanUrlState['filters'], string>

const isValidFilterValue = (
  key: keyof typeof filterValueTypes,
  value: unknown,
): boolean => {
  switch (filterValueTypes[key]) {
    case 'number':
      return isFiniteNumber(value)
    case 'string':
      return typeof value === 'string'
    case 'boolean':
      return typeof value === 'boolean'
    case 'number[]':
      return (
        Array.isArray(value) && value.length > 0 && value.every(isFiniteNumber)
      )
  }
}

// validates a decoded sparse object: per-key shape checks, unknown keys
// and malformed values are dropped, the rest is merged over the
// defaults into a full state
export const sparseToEkPlanState = (
  sparse: unknown,
): EkPlanUrlState | undefined => {
  if (typeof sparse !== 'object' || sparse === null) return undefined
  const source = sparse as Record<string, unknown>
  const result: EkPlanUrlState = {
    ...defaultEkPlanUrlState,
    filters: { ...defaultEkPlanUrlState.filters },
  }
  if (Array.isArray(source.aps)) {
    const aps = source.aps.filter(
      (ap): ap is EkPlanAps =>
        typeof ap === 'object' &&
        ap !== null &&
        typeof (ap as EkPlanAps).value === 'string' &&
        typeof (ap as EkPlanAps).label === 'string',
    )
    if (aps.length > 0) result.aps = aps
  }
  if (Array.isArray(source.fields)) {
    const fields = source.fields.filter(
      (field): field is string => typeof field === 'string',
    )
    if (fields.length > 0) result.fields = [...new Set(fields)]
  }
  if (isFiniteNumber(source.pastYears)) result.pastYears = source.pastYears
  for (const key of [
    'showEk',
    'showEkf',
    'showCount',
    'showEkCount',
    'showMassn',
  ] as const) {
    if (source[key] === false) result[key] = false
  }
  if (typeof source.filters === 'object' && source.filters !== null) {
    for (const [key, value] of Object.entries(
      source.filters as Record<string, unknown>,
    )) {
      if (!(key in filterValueTypes)) continue
      if (isValidFilterValue(key as keyof typeof filterValueTypes, value)) {
        ;(result.filters as Record<string, unknown>)[key] = value
      }
    }
  }
  return result
}

export const encodeEkPlanParam = (state: EkPlanUrlState): string | null => {
  const sparse = buildSparseEkPlanState(state)
  if (Object.keys(sparse).length === 0) return null
  return bytesToB64url(new TextEncoder().encode(JSON.stringify(sparse)))
}

// returns undefined for malformed values (hand-edited or truncated
// links) — callers drop the param in that case
export const decodeEkPlanParam = (
  value: string | null | undefined,
): EkPlanUrlState | undefined => {
  if (!value) return undefined
  try {
    return sparseToEkPlanState(
      JSON.parse(new TextDecoder().decode(b64urlToBytes(value))),
    )
  } catch {
    return undefined
  }
}
