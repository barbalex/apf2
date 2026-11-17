import type { QueryClient } from '@tanstack/react-query'

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

const nextPaint = async () => {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

// wait for in-flight queries to settle; two consecutive idle checks absorb
// mounts that refetch right after their data lands (tpopkontr forms insert
// missing zaehl rows, then refetch). Capped so a hung request cannot
// disable printing.
const waitForQueries = async (queryClient: QueryClient, timeoutMs = 20000) => {
  const start = Date.now()
  let idleChecks = 0
  while (Date.now() - start < timeoutMs) {
    if (queryClient.isFetching() === 0) {
      idleChecks++
      if (idleChecks >= 2) return
    } else {
      idleChecks = 0
    }
    await sleep(150)
  }
}

const waitForImages = async (timeoutMs = 10000) => {
  const pending = Array.from(document.images).filter((img) => !img.complete)
  await Promise.allSettled(
    pending.map((img) =>
      Promise.race([img.decode().catch(() => undefined), sleep(timeoutMs)]),
    ),
  )
}

// Safari/Firefox return from window.print() while the preview is still
// open — resetting the print layout must wait for afterprint (fires once
// the dialog/preview has actually closed). The timeout is only a safety
// net so the app can never stay stuck in print layout.
const whenAfterPrint = (timeoutMs = 60000) =>
  new Promise<void>((resolve) => {
    let settled = false
    const done = () => {
      if (settled) return
      settled = true
      resolve()
    }
    window.addEventListener('afterprint', done, { once: true })
    setTimeout(done, timeoutMs)
  })

// a second click while a print is being prepared or its dialog is open
// would queue a second dialog
let printing = false

/**
 * Prints the current page once everything observable is ready: in-flight
 * queries settled, fonts loaded, images decoded, a frame painted. Replaces
 * fixed timeouts that guessed when the print view had finished rendering.
 * Resolves only after the print dialog has closed (afterprint) — callers
 * reset their print state in .finally. Re-entrant calls are ignored.
 */
export const printWhenReady = async (queryClient: QueryClient) => {
  if (printing) return
  printing = true
  try {
    // let the print layout commit and its queries start before judging idleness
    await nextPaint()
    await waitForQueries(queryClient)
    await document.fonts.ready
    await waitForImages()
    // a final frame lays recharts/ResponsiveContainer out with the final data
    await nextPaint()
    const afterPrint = whenAfterPrint()
    window.print()
    await afterPrint
  } finally {
    printing = false
  }
}
