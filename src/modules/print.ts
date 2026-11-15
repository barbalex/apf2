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
const waitForQueries = async (
  queryClient: QueryClient,
  timeoutMs = 20000,
) => {
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
      Promise.race([
        img.decode().catch(() => undefined),
        sleep(timeoutMs),
      ]),
    ),
  )
}

/**
 * Prints the current page once everything observable is ready: in-flight
 * queries settled, fonts loaded, images decoded, a frame painted. Replaces
 * the former fixed timeouts (15 s AP-Bericht, 3000 + ekfCount * 300 EKF
 * mass print) that guessed when the print view had finished rendering.
 */
export const printWhenReady = async (queryClient: QueryClient) => {
  // let the print layout commit and its queries start before judging idleness
  await nextPaint()
  await waitForQueries(queryClient)
  await document.fonts.ready
  await waitForImages()
  // a final frame lays recharts/ResponsiveContainer out with the final data
  await nextPaint()
  window.print()
}
