// EkPlan (Erfolgskontrolle-Planung) state
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { createUnsubscribedStorage } from './store.ts'

// EkPlan atoms
export const ekPlanShowEkAtom = atom(true)
export const ekPlanShowEkfAtom = atom(true)
export const ekPlanShowCountAtom = atom(true)
export const ekPlanShowEkCountAtom = atom(true)
export const ekPlanShowMassnAtom = atom(true)

// EkPlan aps
export const ekPlanApsAtom = atomWithStorage<
  { value: string; label: string }[]
>(
  'ekPlanAps',
  [],
  createUnsubscribedStorage<{ value: string; label: string }[]>(),
  { getOnInit: true },
)
export const ekPlanApValuesAtom = atom((get) => {
  const aps = get(ekPlanApsAtom)
  return aps.map((a) => a.value)
})
export const ekPlanAddApAtom = atom(
  null,
  (get, set, ap: { value: string; label: string }) => {
    const current = get(ekPlanApsAtom)
    set(ekPlanApsAtom, [...current, ap])
  },
)
export const ekPlanRemoveApAtom = atom(
  null,
  (get, set, ap: { value: string; label: string }) => {
    const current = get(ekPlanApsAtom)
    set(
      ekPlanApsAtom,
      current.filter((a) => a.value !== ap.value),
    )
  },
)

// EkPlan fields
const defaultFields = [
  'ap',
  'popNr',
  'nr',
  'ekfrequenz',
  'ekfrequenzStartjahr',
  'ekfrequenzAbweichend',
]
export const ekPlanFieldsAtom = atom(defaultFields)
export const ekPlanToggleFieldAtom = atom(null, (get, set, field: string) => {
  const current = get(ekPlanFieldsAtom)
  if (current.includes(field)) {
    set(
      ekPlanFieldsAtom,
      current.filter((f) => f !== field),
    )
  } else {
    const unique = [...new Set([...current, field])]
    set(ekPlanFieldsAtom, unique)
  }
})
export const ekPlanAddFieldAtom = atom(null, (get, set, field: string) => {
  const current = get(ekPlanFieldsAtom)
  const unique = [...new Set([...current, field])]
  set(ekPlanFieldsAtom, unique)
})
export const ekPlanRemoveFieldAtom = atom(null, (get, set, field: string) => {
  const current = get(ekPlanFieldsAtom)
  set(
    ekPlanFieldsAtom,
    current.filter((f) => f !== field),
  )
})

// EkPlan hovered
export const ekPlanHoveredAtom = atom<{
  year: number | null
  tpopId: string | null
}>({
  year: null,
  tpopId: null,
})
export const ekPlanSetHoveredYearAtom = atom(
  null,
  (get, set, val: number | null) => {
    const current = get(ekPlanHoveredAtom)
    set(ekPlanHoveredAtom, { ...current, year: val })
  },
)
export const ekPlanSetHoveredTpopIdAtom = atom(
  null,
  (get, set, val: string | null) => {
    const current = get(ekPlanHoveredAtom)
    set(ekPlanHoveredAtom, { ...current, tpopId: val })
  },
)
export const ekPlanResetHoveredAtom = atom(null, (_get, set) => {
  set(ekPlanHoveredAtom, { year: null, tpopId: null })
})

// EkPlan data loading
export const ekPlanApsDataLoadingAtom = atom(true)

// EkPlan filters
export const ekPlanFilterApAtom = atom<string | null>(null)
export const ekPlanFilterPopNrAtom = atom<number | null>(null)
export const ekPlanFilterPopNameAtom = atom<string | null>(null)
export const ekPlanFilterPopStatusAtom = atom([100, 101, 200, 201, 202, 300])
export const ekPlanFilterNrAtom = atom<number | null>(null)
export const ekPlanFilterGemeindeAtom = atom<string | null>(null)
export const ekPlanFilterFlurnameAtom = atom<string | null>(null)
export const ekPlanFilterStatusAtom = atom([100, 101, 200, 201, 202, 300])
export const ekPlanFilterBekanntSeitAtom = atom<number | null>(null)
export const ekPlanFilterLv95XAtom = atom<number | null>(null)
export const ekPlanFilterLv95YAtom = atom<number | null>(null)
export const ekPlanFilterEkfKontrolleurAtom = atom<string | null>(null)
export const ekPlanFilterEkAbrechnungstypAtom = atom<string | null>(null)
export const ekPlanFilterEkfrequenzAtom = atom<string | null>(null)
export const ekPlanFilterEkfrequenzStartjahrAtom = atom<number | null>(null)
export const ekPlanFilterEkfrequenzAbweichendAtom = atom(false)
export const ekPlanFilterEkfrequenzEmptyAtom = atom(false)
export const ekPlanFilterEkfrequenzStartjahrEmptyAtom = atom(false)
export const ekPlanFilterAnsiedlungYearAtom = atom<number | null>(null)
export const ekPlanFilterKontrolleYearAtom = atom<number | null>(null)
export const ekPlanFilterEkplanYearAtom = atom<number | null>(null)

export const ekPlanSetFilterApAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterApAtom, val)
  },
)
export const ekPlanSetFilterPopNrAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterPopNrAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterPopNameAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterPopNameAtom, val)
  },
)
export const ekPlanSetFilterPopStatusAtom = atom(
  null,
  (_get, set, val: number[] | null) => {
    set(ekPlanFilterPopStatusAtom, val || [100, 101, 200, 201, 202, 300])
  },
)
export const ekPlanSetFilterNrAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterNrAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterGemeindeAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterGemeindeAtom, val)
  },
)
export const ekPlanSetFilterFlurnameAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterFlurnameAtom, val)
  },
)
export const ekPlanSetFilterStatusAtom = atom(
  null,
  (_get, set, val: number[] | null) => {
    set(ekPlanFilterStatusAtom, val || [100, 101, 200, 201, 202, 300])
  },
)
export const ekPlanSetFilterBekanntSeitAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterBekanntSeitAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterLv95XAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterLv95XAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterLv95YAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterLv95YAtom, val ? +val : null)
  },
)
// keep this setter as a map is used to set all filters at once and ekfKontrolleur is part of the map
export const ekPlanSetFilterEkfKontrolleurAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterEkfKontrolleurAtom, val)
  },
)
export const ekPlanSetFilterEkAbrechnungstypAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterEkAbrechnungstypAtom, val)
  },
)
export const ekPlanSetFilterEkfrequenzAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterEkfrequenzAtom, val)
  },
)
export const ekPlanSetFilterEkfrequenzStartjahrAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterEkfrequenzStartjahrAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterEkfrequenzAbweichendAtom = atom(
  null,
  (_get, set, val: boolean) => {
    set(ekPlanFilterEkfrequenzAbweichendAtom, val)
  },
)
export const ekPlanSetFilterEmptyEkfrequenzAtom = atom(
  null,
  (_get, set, val: boolean) => {
    set(ekPlanFilterEkfrequenzEmptyAtom, val)
  },
)
export const ekPlanSetFilterAnsiedlungYearAtom = atom(
  null,
  (_get, set, val: number | null) => {
    set(ekPlanFilterAnsiedlungYearAtom, val)
  },
)
export const ekPlanSetFilterKontrolleYearAtom = atom(
  null,
  (_get, set, val: number | null) => {
    set(ekPlanFilterKontrolleYearAtom, val)
  },
)
export const ekPlanSetFilterEkplanYearAtom = atom(
  null,
  (_get, set, val: number | null) => {
    set(ekPlanFilterEkplanYearAtom, val)
  },
)
export const ekPlanSetFilterEmptyEkfrequenzStartjahrAtom = atom(
  null,
  (_get, set, val: boolean) => {
    set(ekPlanFilterEkfrequenzStartjahrEmptyAtom, val)
  },
)

// EkPlan pastYears
export const ekPlanPastYearsAtom = atom(5)

// EkPlan volatile state
export const ekPlanYearMenuAnchorAtom = atom<{
  top: number
  right: number
} | null>(null)

export interface EkPlanYearClicked {
  year: number | null
  tpopId: string | null
  title: string | null
  ekPlan: boolean
  ekfPlan: boolean
}

const initialYearClicked: EkPlanYearClicked = {
  year: null,
  tpopId: null,
  title: null,
  ekPlan: false,
  ekfPlan: false,
}
export const ekPlanYearClickedAtom = atom<EkPlanYearClicked>(initialYearClicked)
export const ekPlanCloseYearCellMenuAtom = atom(null, (_get, set) => {
  set(ekPlanYearMenuAnchorAtom, null)
  set(ekPlanYearClickedAtom, initialYearClicked)
})

// shape of the EkplanAp query result (see src/components/EkPlan/index.tsx)
export interface EkPlanApsData {
  allAps?: {
    nodes: {
      id: string
      ekzaehleinheitsByApId?: {
        nodes?: {
          tpopkontrzaehlEinheitWerteByZaehleinheitId?: {
            code?: string | null
            text?: string | null
          }
        }[]
      }
    }[]
  }
}

export const ekPlanApsDataAtom = atom<EkPlanApsData | undefined>(undefined)

// EkPlan einheitsByAp computed value
export const ekPlanEinheitsByApAtom = atom((get) => {
  const apsData = get(ekPlanApsDataAtom)
  const nodes = apsData?.allAps?.nodes ?? []
  const e: Record<string, (string | null | undefined)[]> = {}
  nodes.forEach((node) => {
    e[node.id] = (node?.ekzaehleinheitsByApId?.nodes ?? []).map(
      (o) => o.tpopkontrzaehlEinheitWerteByZaehleinheitId?.code,
    )
  })
  return e
})
