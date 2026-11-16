import { describe, it, expect } from 'vitest'

import { getActiveNodeArrayFromPathname } from './getActiveNodeArrayFromPathname.ts'

describe('getActiveNodeArrayFromPathname', () => {
  it('drops the leading Daten segment', () => {
    expect(getActiveNodeArrayFromPathname('/Daten/Projekte')).toEqual([
      'Projekte',
    ])
  })

  it('splits on slashes and drops empty segments', () => {
    expect(getActiveNodeArrayFromPathname('/')).toEqual([])
    expect(getActiveNodeArrayFromPathname('/Daten')).toEqual([])
  })

  it('converts pure number segments to numbers', () => {
    expect(getActiveNodeArrayFromPathname('/Daten/Projekte/x/1996')).toEqual([
      'Projekte',
      'x',
      1996,
    ])
  })

  it('keeps ids as strings', () => {
    const id = 'e2a8a095-1a4a-4cf5-9c3c-8d78a5d4a860'
    expect(
      getActiveNodeArrayFromPathname(`/Daten/Projekte/${id}/Arten`),
    ).toEqual(['Projekte', id, 'Arten'])
  })

  it('decodes uri-encoded segments (umlauts in tree labels)', () => {
    expect(
      getActiveNodeArrayFromPathname(
        '/Daten/Dokumentation/Grundlagen%20%C3%B6kologie',
      ),
    ).toEqual(['Dokumentation', 'Grundlagen ökologie'])
  })
})
