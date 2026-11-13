import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// the telemetry module reads VITE_ERROR_TELEMETRY_URL at import time and
// touches window/navigator/fetch only inside its functions — so tests load a
// fresh module instance per case with the env var stubbed and the browser
// globals replaced
const loadModule = async () => {
  vi.resetModules()
  return await import('./errorTelemetry.ts')
}

const fetchMock = vi.fn((_url: string, _init: RequestInit) =>
  Promise.resolve({ ok: true }),
)

const addEventListenerMock = vi.fn()

beforeEach(() => {
  fetchMock.mockClear()
  addEventListenerMock.mockClear()
  vi.stubEnv('VITE_ERROR_TELEMETRY_URL', 'https://errors.example/v1/reports')
  vi.stubGlobal('fetch', fetchMock)
  vi.stubGlobal('window', {
    location: { pathname: '/Daten/Projekte', search: '' },
    addEventListener: addEventListenerMock,
  })
  vi.stubGlobal('navigator', { userAgent: 'vitest' })
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('errorTelemetry', () => {
  it('sends message, stack, url, release and kind as JSON', async () => {
    const { reportError } = await loadModule()
    const error = new Error('boom')
    error.stack = 'Error: boom\n    at someChunk.js:1:2'

    await reportError('manual', error)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] ?? []
    expect(url).toBe('https://errors.example/v1/reports')
    expect(init?.method).toBe('POST')
    expect(init?.keepalive).toBe(true)
    const body = JSON.parse(init?.body as string)
    expect(body.kind).toBe('manual')
    expect(body.message).toBe('boom')
    expect(body.stack).toContain('someChunk.js')
    expect(body.release).toBe('0.0.0-test')
    expect(body.url).toBe('/Daten/Projekte')
    // created_at is stamped server-side, user_agent is snake_case on the wire
    expect(body.user_agent).toBe('vitest')
    expect(body.timestamp).toBeUndefined()
  })

  it('is a no-op without VITE_ERROR_TELEMETRY_URL', async () => {
    vi.stubEnv('VITE_ERROR_TELEMETRY_URL', '')
    const { reportError } = await loadModule()

    await reportError('manual', new Error('boom'))

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('dedupes repeated identical messages', async () => {
    const { reportError } = await loadModule()

    for (let i = 0; i < 6; i++) {
      await reportError('window.error', new Error('loop'))
    }

    // max 3 reports per message, the rest are dropped
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('caps the total number of reports', async () => {
    const { reportError } = await loadModule()

    for (let i = 0; i < 40; i++) {
      await reportError('unhandledrejection', new Error(`distinct-${i}`))
    }

    expect(fetchMock).toHaveBeenCalledTimes(25)
  })

  it('never rejects when the collector is unreachable', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'))
    const { reportError } = await loadModule()

    await expect(reportError('manual', new Error('x'))).resolves.toBeUndefined()
  })

  it('serializes non-Error values', async () => {
    const { reportError } = await loadModule()

    await reportError('unhandledrejection', 'string rejection')

    const [, init] = fetchMock.mock.calls[0] ?? []
    expect(JSON.parse(init?.body as string).message).toBe('string rejection')
  })

  it('installs window handlers that report', async () => {
    const { installErrorTelemetry } = await loadModule()

    installErrorTelemetry()

    expect(addEventListenerMock).toHaveBeenCalledTimes(2)
    const errorHandler = addEventListenerMock.mock.calls.find(
      ([name]) => name === 'error',
    )?.[1] as (event: { error: unknown }) => void
    await errorHandler({ error: new Error('dom') })

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
