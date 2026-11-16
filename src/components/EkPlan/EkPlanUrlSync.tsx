import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useAtomValue, useStore } from 'jotai'
import type { PrimitiveAtom } from 'jotai'

import {
  decodeEkPlanParam,
  encodeEkPlanParam,
  ekPlanParamName,
} from '../../modules/ekPlanParam.ts'
import type { EkPlanUrlState } from '../../modules/ekPlanParam.ts'
import {
  ekPlanApsAtom,
  ekPlanFieldsAtom,
  ekPlanFilterAnsiedlungYearAtom,
  ekPlanFilterApAtom,
  ekPlanFilterBekanntSeitAtom,
  ekPlanFilterEkAbrechnungstypAtom,
  ekPlanFilterEkfKontrolleurAtom,
  ekPlanFilterEkfrequenzAbweichendAtom,
  ekPlanFilterEkfrequenzAtom,
  ekPlanFilterEkfrequenzEmptyAtom,
  ekPlanFilterEkfrequenzStartjahrAtom,
  ekPlanFilterEkfrequenzStartjahrEmptyAtom,
  ekPlanFilterEkplanYearAtom,
  ekPlanFilterGemeindeAtom,
  ekPlanFilterKontrolleYearAtom,
  ekPlanFilterLv95XAtom,
  ekPlanFilterLv95YAtom,
  ekPlanFilterNrAtom,
  ekPlanFilterPopNameAtom,
  ekPlanFilterPopNrAtom,
  ekPlanFilterPopStatusAtom,
  ekPlanFilterStatusAtom,
  ekPlanFilterFlurnameAtom,
  ekPlanPastYearsAtom,
  ekPlanShowCountAtom,
  ekPlanShowEkAtom,
  ekPlanShowEkCountAtom,
  ekPlanShowEkfAtom,
  ekPlanShowMassnAtom,
} from '../../store/index.ts'

// filter inputs write per keystroke — the debounce keeps the url (and
// the re-renders of search subscribers) out of keystroke frequency
const writeDebounceMs = 250

// the url-relevant state as one value per atom; the volatile state
// (hover, open menus, data cache) never travels
const stateToFilterAtoms = {
  ap: ekPlanFilterApAtom,
  popNr: ekPlanFilterPopNrAtom,
  popName: ekPlanFilterPopNameAtom,
  popStatus: ekPlanFilterPopStatusAtom,
  nr: ekPlanFilterNrAtom,
  gemeinde: ekPlanFilterGemeindeAtom,
  flurname: ekPlanFilterFlurnameAtom,
  status: ekPlanFilterStatusAtom,
  bekanntSeit: ekPlanFilterBekanntSeitAtom,
  lv95X: ekPlanFilterLv95XAtom,
  lv95Y: ekPlanFilterLv95YAtom,
  ekfKontrolleur: ekPlanFilterEkfKontrolleurAtom,
  ekAbrechnungstyp: ekPlanFilterEkAbrechnungstypAtom,
  ekfrequenz: ekPlanFilterEkfrequenzAtom,
  ekfrequenzStartjahr: ekPlanFilterEkfrequenzStartjahrAtom,
  ekfrequenzAbweichend: ekPlanFilterEkfrequenzAbweichendAtom,
  ekfrequenzEmpty: ekPlanFilterEkfrequenzEmptyAtom,
  ekfrequenzStartjahrEmpty: ekPlanFilterEkfrequenzStartjahrEmptyAtom,
  ansiedlungYear: ekPlanFilterAnsiedlungYearAtom,
  kontrolleYear: ekPlanFilterKontrolleYearAtom,
  ekplanYear: ekPlanFilterEkplanYearAtom,
} as const

/**
 * keeps the EkPlan plan state linkable in the url (?ekplan=, sparse
 * json, base64url): on mount the param wins over the stored/in-memory
 * values; afterwards every change is written back through the router
 * (replace, debounced) and reconciled whenever the url diverges —
 * params set from handlers evaluate against the last committed search,
 * so racing navigations can drop it. Leaving the route removes the
 * param so it does not linger on other urls.
 */
export const EkPlanUrlSync = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const targetStore = useStore()

  const aps = useAtomValue(ekPlanApsAtom)
  const fields = useAtomValue(ekPlanFieldsAtom)
  const pastYears = useAtomValue(ekPlanPastYearsAtom)
  const showEk = useAtomValue(ekPlanShowEkAtom)
  const showEkf = useAtomValue(ekPlanShowEkfAtom)
  const showCount = useAtomValue(ekPlanShowCountAtom)
  const showEkCount = useAtomValue(ekPlanShowEkCountAtom)
  const showMassn = useAtomValue(ekPlanShowMassnAtom)
  const filterAp = useAtomValue(ekPlanFilterApAtom)
  const filterPopNr = useAtomValue(ekPlanFilterPopNrAtom)
  const filterPopName = useAtomValue(ekPlanFilterPopNameAtom)
  const filterPopStatus = useAtomValue(ekPlanFilterPopStatusAtom)
  const filterNr = useAtomValue(ekPlanFilterNrAtom)
  const filterGemeinde = useAtomValue(ekPlanFilterGemeindeAtom)
  const filterFlurname = useAtomValue(ekPlanFilterFlurnameAtom)
  const filterStatus = useAtomValue(ekPlanFilterStatusAtom)
  const filterBekanntSeit = useAtomValue(ekPlanFilterBekanntSeitAtom)
  const filterLv95X = useAtomValue(ekPlanFilterLv95XAtom)
  const filterLv95Y = useAtomValue(ekPlanFilterLv95YAtom)
  const filterEkfKontrolleur = useAtomValue(ekPlanFilterEkfKontrolleurAtom)
  const filterEkAbrechnungstyp = useAtomValue(ekPlanFilterEkAbrechnungstypAtom)
  const filterEkfrequenz = useAtomValue(ekPlanFilterEkfrequenzAtom)
  const filterEkfrequenzStartjahr = useAtomValue(
    ekPlanFilterEkfrequenzStartjahrAtom,
  )
  const filterEkfrequenzAbweichend = useAtomValue(
    ekPlanFilterEkfrequenzAbweichendAtom,
  )
  const filterEkfrequenzEmpty = useAtomValue(ekPlanFilterEkfrequenzEmptyAtom)
  const filterEkfrequenzStartjahrEmpty = useAtomValue(
    ekPlanFilterEkfrequenzStartjahrEmptyAtom,
  )
  const filterAnsiedlungYear = useAtomValue(ekPlanFilterAnsiedlungYearAtom)
  const filterKontrolleYear = useAtomValue(ekPlanFilterKontrolleYearAtom)
  const filterEkplanYear = useAtomValue(ekPlanFilterEkplanYearAtom)

  const settled = useRef(false)
  const firstChangeRun = useRef(true)
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stateFromSubscribedValues: EkPlanUrlState = {
    aps,
    fields,
    pastYears,
    showEk,
    showEkf,
    showCount,
    showEkCount,
    showMassn,
    filters: {
      ap: filterAp,
      popNr: filterPopNr,
      popName: filterPopName,
      popStatus: filterPopStatus,
      nr: filterNr,
      gemeinde: filterGemeinde,
      flurname: filterFlurname,
      status: filterStatus,
      bekanntSeit: filterBekanntSeit,
      lv95X: filterLv95X,
      lv95Y: filterLv95Y,
      ekfKontrolleur: filterEkfKontrolleur,
      ekAbrechnungstyp: filterEkAbrechnungstyp,
      ekfrequenz: filterEkfrequenz,
      ekfrequenzStartjahr: filterEkfrequenzStartjahr,
      ekfrequenzAbweichend: filterEkfrequenzAbweichend,
      ekfrequenzEmpty: filterEkfrequenzEmpty,
      ekfrequenzStartjahrEmpty: filterEkfrequenzStartjahrEmpty,
      ansiedlungYear: filterAnsiedlungYear,
      kontrolleYear: filterKontrolleYear,
      ekplanYear: filterEkplanYear,
    },
  }

  const readStateFromStore = (): EkPlanUrlState => ({
    aps: targetStore.get(ekPlanApsAtom),
    fields: targetStore.get(ekPlanFieldsAtom),
    pastYears: targetStore.get(ekPlanPastYearsAtom),
    showEk: targetStore.get(ekPlanShowEkAtom),
    showEkf: targetStore.get(ekPlanShowEkfAtom),
    showCount: targetStore.get(ekPlanShowCountAtom),
    showEkCount: targetStore.get(ekPlanShowEkCountAtom),
    showMassn: targetStore.get(ekPlanShowMassnAtom),
    filters: Object.fromEntries(
      Object.entries(stateToFilterAtoms).map(([key, filterAtom]) => [
        key,
        targetStore.get(filterAtom as PrimitiveAtom<unknown>),
      ]),
    ) as EkPlanUrlState['filters'],
  })

  const applyState = (state: EkPlanUrlState) => {
    targetStore.set(ekPlanApsAtom, state.aps)
    targetStore.set(ekPlanFieldsAtom, state.fields)
    targetStore.set(ekPlanPastYearsAtom, state.pastYears)
    targetStore.set(ekPlanShowEkAtom, state.showEk)
    targetStore.set(ekPlanShowEkfAtom, state.showEkf)
    targetStore.set(ekPlanShowCountAtom, state.showCount)
    targetStore.set(ekPlanShowEkCountAtom, state.showEkCount)
    targetStore.set(ekPlanShowMassnAtom, state.showMassn)
    for (const [key, filterAtom] of Object.entries(stateToFilterAtoms)) {
      targetStore.set(
        filterAtom as PrimitiveAtom<unknown>,
        state.filters[key as keyof EkPlanUrlState['filters']],
      )
    }
  }

  const removeEkPlanParam = () => {
    setSearchParams(
      (prev) => {
        if (!prev.has(ekPlanParamName)) return prev
        const next = new URLSearchParams(prev)
        next.delete(ekPlanParamName)
        return next
      },
      { replace: true },
    )
  }

  // on mount: the param wins, then complete the url with the
  // now-effective state (read from the store because this render's
  // subscribed values are pre-seed). Declared before the change effect
  // so that one skips its own stale first run
  useEffect(() => {
    const encoded = searchParams.get(ekPlanParamName)
    if (encoded !== null) {
      const decoded = decodeEkPlanParam(encoded)
      if (decoded) {
        applyState(decoded)
      } else {
        removeEkPlanParam()
      }
    }
    const effectiveEncoded = encodeEkPlanParam(readStateFromStore())
    if (effectiveEncoded !== null && effectiveEncoded !== encoded) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set(ekPlanParamName, effectiveEncoded)
          return next
        },
        { replace: true },
      )
    }
    settled.current = true
    return () => {
      settled.current = false
      firstChangeRun.current = true
      if (writeTimer.current) clearTimeout(writeTimer.current)
      // leaving the route: the param describes EkPlan state only
      removeEkPlanParam()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep the url current: debounced on state changes, immediate
  // reconciliation when the url diverges. Its first run happens in the
  // same commit as the mount effect above, with pre-seed (stale)
  // subscribed values — skip exactly that one run
  useEffect(() => {
    if (firstChangeRun.current) {
      firstChangeRun.current = false
      return
    }
    if (!settled.current) return
    const encoded = encodeEkPlanParam(stateFromSubscribedValues)
    const current = searchParams.get(ekPlanParamName)
    if (encoded === current) return

    if (writeTimer.current) clearTimeout(writeTimer.current)
    writeTimer.current = setTimeout(() => {
      writeTimer.current = null
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (encoded === null) next.delete(ekPlanParamName)
          else next.set(ekPlanParamName, encoded)
          return next
        },
        { replace: true },
      )
    }, writeDebounceMs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateFromSubscribedValues, searchParams])

  useEffect(
    () => () => {
      if (writeTimer.current) clearTimeout(writeTimer.current)
    },
    [],
  )

  return null
}
