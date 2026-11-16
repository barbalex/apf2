import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// like the telemetry tests: the module touches window/localStorage only
// inside its functions — tests load a fresh instance per case with the
// browser globals replaced. dropCachesAndWorker's caches/serviceWorker
// access throws (ReferenceError) in node and is caught, so no stubbing
// needed there.
const loadModule = async () => {
  vi.resetModules()
  return await import('./installPreloadErrorRecovery.ts')
}

const addEventListenerMock = vi.fn()
const reloadMock = vi.fn()

const firePreloadError = async () => {
  const handler = addEventListenerMock.mock.calls.at(-1)?.[1] as () => void
  handler()
  // recover() is fire-and-forget from the listener: let it settle
  await new Promise((resolve) => setTimeout(resolve, 0))
}

beforeEach(() => {
  addEventListenerMock.mockClear()
  reloadMock.mockClear()
  localStorage.clear()
  vi.stubGlobal('window', {
    addEventListener: addEventListenerMock,
    location: { reload: reloadMock },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('installPreloadErrorRecovery', () => {
  it('reloads on the first vite:preloadError', async () => {
    const { installPreloadErrorRecovery } = await loadModule()

    installPreloadErrorRecovery()
    expect(addEventListenerMock).toHaveBeenCalledWith(
      'vite:preloadError',
      expect.any(Function),
    )
    await firePreloadError()

    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  it('reloads at most MAX_ATTEMPTS times', async () => {
    const { installPreloadErrorRecovery } = await loadModule()

    installPreloadErrorRecovery()
    for (let i = 0; i < 6; i++) await firePreloadError()

    expect(reloadMock).toHaveBeenCalledTimes(3)
  })

  it('starts fresh after the attempt window expired', async () => {
    const { installPreloadErrorRecovery } = await loadModule()

    installPreloadErrorRecovery()
    for (let i = 0; i < 6; i++) await firePreloadError()
    expect(reloadMock).toHaveBeenCalledTimes(3)

    // age out the counter: a much-later incident gets new attempts
    const raw = JSON.parse(localStorage.getItem('preloadErrorRecoveryAttempts') ?? '{}') as {
      attempts: number
      startedAt: number
    }
    localStorage.setItem(
      'preloadErrorRecoveryAttempts',
      JSON.stringify({ ...raw, startedAt: Date.now() - 6 * 60 * 1000 }),
    )
    await firePreloadError()

    expect(reloadMock).toHaveBeenCalledTimes(4)
  })
})
