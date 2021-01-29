/**
 * This is necessary because:
 * - null and undefined have no toString function
 */
const toStringIfPossible = (val) => {
  if (val === null) return val
  if (val === undefined) return val
  if (typeof val === 'object') return JSON.stringify(val)
  if (val.toString) return val.toString()
  return val
}

export default toStringIfPossible
