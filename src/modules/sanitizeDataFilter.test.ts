import { describe, expect, it } from 'vitest'

import { sanitizeDataFilter } from './sanitizeDataFilter.ts'
import { initialDataFilterValues } from '../store/initialDataFilterValues.ts'

describe('sanitizeDataFilter', () => {
  it('returns the initial values for non-objects', () => {
    expect(sanitizeDataFilter(undefined)).toEqual(initialDataFilterValues)
    expect(sanitizeDataFilter(null)).toEqual(initialDataFilterValues)
    expect(sanitizeDataFilter('ap')).toEqual(initialDataFilterValues)
    expect(sanitizeDataFilter([])).toEqual(initialDataFilterValues)
  })

  it('returns the initial values for an empty object', () => {
    expect(sanitizeDataFilter({})).toEqual(initialDataFilterValues)
  })

  it('keeps known tables and fields, drops unknown tables and fields', () => {
    const sanitized = sanitizeDataFilter({
      ap: [{ startJahr: 2020, noLongerAField: 'x' }],
      notATable: [{ nr: 1 }],
    })
    expect(sanitized.ap).toEqual([{ startJahr: 2020 }])
    expect('notATable' in sanitized).toBe(false)
    // untouched tables keep their initial value
    expect(sanitized.pop).toEqual(initialDataFilterValues.pop)
  })

  it('drops non-object tabs and normalizes missing fields to null', () => {
    const sanitized = sanitizeDataFilter({
      pop: ['junk', { nr: 3 }, null],
    })
    expect(sanitized.pop).toEqual([{ nr: 3 }])
  })

  it('keeps multi-or tabs in order', () => {
    const sanitized = sanitizeDataFilter({
      tpop: [{ nr: 1 }, { nr: 2, gemeinde: 'Zürich' }],
    })
    expect(sanitized.tpop).toEqual([{ nr: 1 }, { nr: 2, gemeinde: 'Zürich' }])
  })

  it('falls back to the initial tab when nothing survives', () => {
    const sanitized = sanitizeDataFilter({
      ap: [{ noLongerAField: 'x' }],
    })
    expect(sanitized.ap).toEqual(initialDataFilterValues.ap)
  })
})
