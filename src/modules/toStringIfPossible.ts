/**
 * This is necessary because:
 * - null and undefined have no toString function
 */
export const toStringIfPossible = (val: unknown): string | null | undefined => {
  if (val === null) return val
  if (val === undefined) return val
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}
