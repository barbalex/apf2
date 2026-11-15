import { describe, expect, it } from 'vitest'

import {
  labelFilterPrefix,
  labelFilterSearchString,
  readLabelFilterFromSearchParams,
  writeLabelFilterToSearchParams,
} from './labelFilterSearchParam.ts'

describe('labelFilterSearchParam', () => {
  it('reads typed params into per-type entries', () => {
    const params = new URLSearchParams('labelFilter.pop=Eg&labelFilter.tpop=Zürich')
    expect(readLabelFilterFromSearchParams(params)).toEqual({
      pop: 'Eg',
      tpop: 'Zürich',
    })
  })

  it('ignores other params and empty values', () => {
    const params = new URLSearchParams(
      'labelFilter.pop=&labelFilter.pop.x=1&map=12/47.3/8.5&f=abc',
    )
    expect(readLabelFilterFromSearchParams(params)).toEqual({
      // labelFilter.pop.x is not a type param of its own — pop stays empty
    })
  })

  it('builds a canonical string with sorted, non-empty entries', () => {
    expect(
      labelFilterSearchString({ tpop: 'X', pop: 'Eg', ap: '', ziel: '' }),
    ).toBe('labelFilter.pop=Eg&labelFilter.tpop=X')
  })

  it('returns an empty string when nothing is filtered', () => {
    expect(labelFilterSearchString({ ap: '', pop: '' })).toBe('')
  })

  it('writes entries and replaces stale ones, keeping other params', () => {
    const stale = new URLSearchParams('map=12/47.3/8.5&labelFilter.pop=Old&labelFilter.tpop=Old')
    const written = writeLabelFilterToSearchParams(stale, { pop: 'Eg' })
    expect(written.get('map')).toBe('12/47.3/8.5')
    expect(written.get(`${labelFilterPrefix}pop`)).toBe('Eg')
    expect(written.has(`${labelFilterPrefix}tpop`)).toBe(false)
  })

  it('round trips write -> read', () => {
    const entries = { pop: 'Eg', tpop: 'Zürich' }
    const written = writeLabelFilterToSearchParams(new URLSearchParams(), entries)
    expect(readLabelFilterFromSearchParams(written)).toEqual(entries)
  })
})
