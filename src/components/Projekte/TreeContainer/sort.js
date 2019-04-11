const exists = value => !!value || value === 0

const sort = (a, b, i) => {
  // return if no element at this index
  if (!exists(a[i]) && !exists(b[i])) return 0
  // sort array with no more element at this position first
  if (!exists(a[i]) && exists(b[i])) return -1
  if (exists(a[i]) && !exists(b[i])) return 1
  // sort numbers by value
  if (!isNaN(a[i]) && !isNaN(b[i])) {
    if (a[i] === b[i]) return sort(a, b, i + 1)
    return a - b
  }
  // use string value to compare mixed types
  const aI = isNaN(a[i]) ? a[i] : a[i].toString()
  const bI = isNaN(b[i]) ? b[i] : b[i].toString()
  if (aI.toLowerCase() === bI.toLowerCase()) return sort(a, b, i + 1)
  if (aI.toLowerCase() < bI.toLowerCase()) return -1
  if (aI.toLowerCase() > bI.toLowerCase()) return 1
}

export default (a, b) => {
  return sort(a, b, 0)
}
