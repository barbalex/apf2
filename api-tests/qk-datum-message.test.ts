// Regression test for #840: Massnahmen/Kontrollen with a year but no date
// must produce QK messages. Runs the REAL fetchQkData + createMessageFunctions
// with a mocked apiFetch — no backend needed.
//
// Beyond the date checks this also covers the other check families that
// nest child rows via tpopChildWrapFromRows/popChildCheck: the phase-5
// rewrite had wrapped them under "tpopChildRel"/"popChildRel", keys that
// createMessageFunctions never reads — 21 checks silently returned no
// messages at all.
import { describe, it, expect, vi, beforeEach } from 'vitest'

const apiFetchMock = vi.fn()
vi.mock('../src/modules/api.ts', () => ({
  apiFetch: (...args: unknown[]) => apiFetchMock(...args),
}))

const { fetchQkData } =
  await import('../src/components/Projekte/Daten/Qk/Qk/fetchQkData.ts')
const { createMessageFunctions } =
  await import('../src/components/Projekte/Daten/Qk/Qk/createMessageFunctions.ts')

const projId = '11111111-1111-1111-1111-111111111111'
const apId = '22222222-2222-2222-2222-222222222222'

const popRow = { id: 'pop-1', nr: 1, name: 'Pop 1' }
const tpopRow = { id: 'tpop-1', nr: 1, pop_id: 'pop-1' }

const runCheck = async (
  check: string,
  extraRoutes: Record<string, unknown[]> = {},
) => {
  const { data } = await fetchQkData({
    projId,
    apId,
    berichtjahr: 2026,
    activeChecks: { [check]: true },
    minDatum: '1926-11-11',
    maxDatum: '2126-11-11',
  })
  const messageFunctions = createMessageFunctions({ data, projId, apId })
  return messageFunctions[check]?.() ?? []
}

/** default context + one Massnahme and one Feldkontrolle with year, no date */
const defaultRoutes = () => ({
  '/q_pop': [popRow],
  '/rpc/query_tpop': [tpopRow],
  '/rpc/query_tpopmassn': [
    { id: 'massn-1', jahr: 2026, tpop_id: 'tpop-1', datum: null },
  ],
  '/rpc/query_tpopkontr': [
    { id: 'kontr-1', jahr: 2026, tpop_id: 'tpop-1', datum: null },
  ],
})

const mockRoutes = (routes: Record<string, unknown[]>) => {
  apiFetchMock.mockReset()
  apiFetchMock.mockImplementation(async (url: string) => {
    // longest prefix wins: "/rpc/query_tpop" also matches
    // "/rpc/query_tpopmassn" etc.
    const match = Object.entries(routes)
      .filter(([prefix]) => url.startsWith(prefix))
      .sort((a, b) => b[0].length - a[0].length)[0]
    if (match) return match[1]
    console.warn('unmocked apiFetch route:', url)
    return []
  })
}

beforeEach(() => mockRoutes(defaultRoutes()))

describe('QK for missing/suspicious dates (#840)', () => {
  it('tpopmassnDatum lists Massnahmen with year but no date', async () => {
    const messages = await runCheck('tpopmassnDatum')
    expect(messages.length).toBe(1)
    expect(messages[0]?.text).toContain('Massnahme: 2026')
  })

  it('tpopfeldkontrDatum lists Feldkontrollen with year but no date', async () => {
    const messages = await runCheck('tpopfeldkontrDatum')
    expect(messages.length).toBe(1)
    expect(messages[0]?.text).toContain('Kontrolle: 2026')
  })

  it('tpopfreiwkontrDatum lists Freiwilligen-Kontrollen with year but no date', async () => {
    mockRoutes({
      ...defaultRoutes(),
      '/rpc/query_tpopkontr': [
        { id: 'kontr-f', jahr: 2026, tpop_id: 'tpop-1', datum: null },
      ],
    })
    const messages = await runCheck('tpopfreiwkontrDatum')
    expect(messages.length).toBe(1)
  })
})

describe('other tpopChild/popChild-wrapped checks (phase-5 regression)', () => {
  it('tpopberOhneJahr lists its rows', async () => {
    mockRoutes({
      '/q_pop': [popRow],
      '/rpc/query_tpop': [tpopRow],
      '/rpc/query_tpopber': [
        { id: 'tpopber-1', jahr: null, tpop_id: 'tpop-1' },
      ],
    })
    const messages = await runCheck('tpopberOhneJahr')
    expect(messages.length).toBe(1)
  })

  it('popberOhneJahr lists its rows', async () => {
    mockRoutes({
      '/q_pop': [popRow],
      '/rpc/query_tpop': [tpopRow],
      '/rpc/query_popber': [{ id: 'popber-1', jahr: null, pop_id: 'pop-1' }],
    })
    const messages = await runCheck('popberOhneJahr')
    expect(messages.length).toBe(1)
  })

  it('tpopfeldkontrOhneZaehlung lists Kontrollen without Zaehlung', async () => {
    mockRoutes({
      '/q_pop': [popRow],
      '/rpc/query_tpop': [tpopRow],
      '/rpc/query_tpopkontr': [
        { id: 'kontr-1', jahr: 2026, tpop_id: 'tpop-1' },
      ],
      // no zaehlungen exist
      '/q_tpopkontrzaehl': [],
    })
    const messages = await runCheck('tpopfeldkontrOhneZaehlung')
    expect(messages.length).toBe(1)
  })

  it('feldkontrzaehlungOhneEinheit lists Zaehlungen without Einheit', async () => {
    mockRoutes({
      '/q_pop': [popRow],
      '/rpc/query_tpop': [tpopRow],
      '/rpc/query_tpopkontr': [
        { id: 'kontr-1', jahr: 2026, tpop_id: 'tpop-1' },
      ],
      '/q_tpopkontrzaehl': [
        {
          id: 'zaehl-1',
          tpopkontr_id: 'kontr-1',
          einheit: null,
          methode: null,
          anzahl: null,
        },
      ],
    })
    const messages = await runCheck('feldkontrzaehlungOhneEinheit')
    expect(messages.length).toBe(1)
    expect(messages[0]?.text).toContain('Zählung: zaehl-1')
    // the url must reach the zaehlung's kontr form
    expect(messages[0]?.url).toContain('kontr-1')
  })

  it('freiwkontrzaehlungOhneMethode lists kontrs whose zaehlungen all lack methode', async () => {
    mockRoutes({
      '/q_pop': [popRow],
      '/rpc/query_tpop': [tpopRow],
      '/rpc/query_tpopkontr': [
        { id: 'kontr-1', jahr: 2026, tpop_id: 'tpop-1' },
      ],
      '/tpopkontrzaehl_einheit_werte': [
        { code: 1, needs_no_methode_anzahl: false },
      ],
      '/q_tpopkontrzaehl': [
        {
          id: 'zaehl-1',
          tpopkontr_id: 'kontr-1',
          einheit: 1,
          methode: null,
          anzahl: null,
        },
      ],
    })
    const messages = await runCheck('freiwkontrzaehlungOhneMethode')
    expect(messages.length).toBe(1)
  })
})

describe('new Datum-vs-Jahr checks (#840)', () => {
  const mismatchRow = {
    projId,
    apId,
    popId: 'pop-1',
    popNr: 1,
    tpopId: 'tpop-1',
    tpopNr: 1,
    id: 'massn-1',
    jahr: 2020,
    bemerkung: 'Jahr: 2020, Datum: 15.03.2015',
  }

  it('tpopmassnDatumJahr lists Massnahmen whose datum year differs from jahr', async () => {
    mockRoutes({
      '/v_q_tpopmassn_datum_jahr': [mismatchRow],
    })
    const messages = await runCheck('tpopmassnDatumJahr')
    expect(messages.length).toBe(1)
    expect(messages[0]?.text).toContain('Massnahme: 2020')
    expect(messages[0]?.text).toContain('Jahr: 2020, Datum: 15.03.2015')
    expect(messages[0]?.url).toContain('Massnahmen')
    expect(messages[0]?.url).toContain('massn-1')
  })

  it('tpopfeldkontrDatumJahr lists Feldkontrollen whose datum year differs', async () => {
    mockRoutes({
      '/v_q_tpopfeldkontr_datum_jahr': [{ ...mismatchRow, id: 'kontr-1' }],
    })
    const messages = await runCheck('tpopfeldkontrDatumJahr')
    expect(messages.length).toBe(1)
    expect(messages[0]?.url).toContain('Feld-Kontrollen')
  })

  it('tpopfreiwkontrDatumJahr lists Freiwilligen-Kontrollen whose datum year differs', async () => {
    mockRoutes({
      '/v_q_tpopfreiwkontr_datum_jahr': [{ ...mismatchRow, id: 'kontr-1' }],
    })
    const messages = await runCheck('tpopfreiwkontrDatumJahr')
    expect(messages.length).toBe(1)
    expect(messages[0]?.url).toContain('Freiwilligen-Kontrollen')
  })
})
