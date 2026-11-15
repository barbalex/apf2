import { describe, expect, it } from 'vitest'

import {
  buildSparseEkPlanState,
  decodeEkPlanParam,
  defaultEkPlanUrlState,
  encodeEkPlanParam,
  sparseToEkPlanState,
} from './ekPlanParam.ts'

type EkPlanStatePartial = Partial<Omit<typeof defaultEkPlanUrlState, 'filters'>> & {
  filters?: Partial<typeof defaultEkPlanUrlState.filters>
}

const withState = (partial: EkPlanStatePartial) => ({
  ...defaultEkPlanUrlState,
  ...partial,
  filters: {
    ...defaultEkPlanUrlState.filters,
    ...(partial.filters ?? {}),
  },
})

describe('ekPlanParam', () => {
  it('encodes nothing for the default state', () => {
    expect(encodeEkPlanParam(defaultEkPlanUrlState)).toBeNull()
    expect(buildSparseEkPlanState(defaultEkPlanUrlState)).toEqual({})
  })

  it('round trips a plan with aps, fields and filters', () => {
    const state = withState({
      aps: [{ value: 'ap-1', label: 'Ranunculus reptans' }],
      fields: ['ap', 'nr', 'gemeinde'],
      pastYears: 2,
      showEk: false,
      filters: { popName: 'Eg', popStatus: [100], kontrolleYear: 2025 },
    })
    const decoded = decodeEkPlanParam(encodeEkPlanParam(state))
    expect(decoded).toEqual(state)
  })

  it('drops default values from the sparse form', () => {
    const sparse = buildSparseEkPlanState(
      withState({ filters: { popName: 'Eg' } }),
    )
    expect(sparse).toEqual({ filters: { popName: 'Eg' } })
  })

  it('keeps explicitly disabled status filters', () => {
    // the default status filter is the full list — an empty selection
    // differs and must survive (encoded as the changed array)
    const sparse = buildSparseEkPlanState(
      withState({ filters: { status: [300] } }),
    )
    expect(sparse).toEqual({ filters: { status: [300] } })
  })

  it('merges a sparse object over the defaults', () => {
    const state = sparseToEkPlanState({ pastYears: 3 })
    expect(state?.pastYears).toBe(3)
    expect(state?.fields).toEqual(defaultEkPlanUrlState.fields)
    expect(state?.filters.popStatus).toEqual(
      defaultEkPlanUrlState.filters.popStatus,
    )
  })

  it('drops malformed values and unknown keys', () => {
    const state = sparseToEkPlanState({
      aps: [{ value: 'ap-1' }, 'junk', { value: 5, label: 'x' }],
      fields: ['nr', 7],
      pastYears: 'viele',
      noSuchKey: true,
      filters: { popName: 'Eg', popNr: 'x', gemeinde: 4, noSuchFilter: 1 },
    })
    expect(state?.aps).toEqual([])
    expect(state?.fields).toEqual(['nr'])
    expect(state?.pastYears).toBe(defaultEkPlanUrlState.pastYears)
    expect(state?.filters.popName).toBe('Eg')
    expect(state?.filters.popNr).toBeNull()
    expect(state?.filters.gemeinde).toBeNull()
  })

  it('returns undefined for non-objects and garbage', () => {
    expect(sparseToEkPlanState('junk')).toBeUndefined()
    expect(sparseToEkPlanState(null)).toBeUndefined()
    expect(decodeEkPlanParam('!!!not-base64!!!')).toBeUndefined()
    expect(decodeEkPlanParam('aG9ndXM')).toBeUndefined()
    expect(decodeEkPlanParam(null)).toBeUndefined()
  })

  it('produces url-safe output', () => {
    const encoded = encodeEkPlanParam(
      withState({ aps: [{ value: 'ap-1', label: 'Ätsch (groß)' }] }),
    )
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
  })
})
