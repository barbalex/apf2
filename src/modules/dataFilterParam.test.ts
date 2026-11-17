import { describe, expect, it } from 'vitest'

import {
  decodeDataFilterParam,
  encodeDataFilterParam,
} from './dataFilterParam.ts'
import { initialDataFilterValues } from '../store/initialDataFilterValues.ts'

const apTab = initialDataFilterValues.ap[0] as Record<string, unknown>
const popTab = initialDataFilterValues.pop[0] as Record<string, unknown>
const tpopTab = initialDataFilterValues.tpop[0] as Record<string, unknown>

const withFilter = (partial: Record<string, Record<string, unknown>[]>) =>
  ({
    ...initialDataFilterValues,
    ...partial,
  }) as typeof initialDataFilterValues

describe('dataFilterParam', () => {
  it('encodes a sparse filter and decodes it back (round trip)', () => {
    const filter = withFilter({
      ap: [{ ...apTab, bearbeitung: 1 }],
      pop: [{ ...popTab, name: 'Eg' }],
    })
    const encoded = encodeDataFilterParam(filter)
    expect(encoded).toBeTruthy()
    expect(decodeDataFilterParam(encoded)).toEqual(filter)
  })

  it('survives umlauts and special characters', () => {
    const filter = withFilter({
      pop: [{ ...popTab, name: 'Bärenfalle (groß)' }],
    })
    expect(decodeDataFilterParam(encodeDataFilterParam(filter))).toEqual(filter)
  })

  it('preserves value types: numbers, booleans, arrays', () => {
    const filter = withFilter({
      tpop: [
        {
          ...tpopTab,
          radius: 12.5,
          statusUnklar: true,
          status: ['300', '500'],
        },
      ],
    })
    const decoded = decodeDataFilterParam(encodeDataFilterParam(filter))
    expect(decoded?.tpop?.[0]).toEqual(
      filter.tpop[0] as Record<string, unknown>,
    )
  })

  it('keeps multiple oder-tabs in order', () => {
    const filter = withFilter({
      pop: [
        { ...popTab, name: 'Eg' },
        { ...popTab, nr: 3 },
      ],
    })
    expect(decodeDataFilterParam(encodeDataFilterParam(filter))).toEqual(filter)
  })

  it('returns null when nothing is filtered', () => {
    expect(encodeDataFilterParam(initialDataFilterValues)).toBeNull()
    const onlyEmptyStrings = withFilter({
      pop: [{ ...popTab, name: '' }],
    })
    expect(encodeDataFilterParam(onlyEmptyStrings)).toBeNull()
  })

  it('drops empty oder-tabs and tables without values', () => {
    const filter = withFilter({
      ap: [apTab, { ...apTab, startJahr: 2020 }],
      pop: [popTab],
    })
    const decoded = decodeDataFilterParam(encodeDataFilterParam(filter))
    expect(decoded?.ap).toHaveLength(1)
    expect(decoded?.pop).toEqual(initialDataFilterValues.pop)
  })

  it('fills sparse tabs back to the full shape (all keys present)', () => {
    const encoded = encodeDataFilterParam(
      withFilter({
        pop: [{ ...popTab, name: 'Eg' }],
      }),
    )
    const decoded = decodeDataFilterParam(encoded)
    const decodedPopTab = decoded?.pop[0]
    expect(Object.keys(decodedPopTab ?? {})).toEqual(Object.keys(popTab ?? {}))
    expect(decodedPopTab?.nr).toBeNull()
  })

  it('produces url-safe output (no escaping needed)', () => {
    const encoded = encodeDataFilterParam(
      withFilter({
        pop: [{ ...popTab, name: 'Eg' }],
      }),
    )
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('returns undefined for malformed values', () => {
    expect(decodeDataFilterParam('!!!not-base64!!!')).toBeUndefined()
    expect(decodeDataFilterParam('aG9ndXM')).toBeUndefined() // valid b64, invalid json
    expect(decodeDataFilterParam(null)).toBeUndefined()
    expect(decodeDataFilterParam('')).toBeUndefined()
  })
})
