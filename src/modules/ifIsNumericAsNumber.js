import isNumeric from './isNumeric.js'

const ifIsNumericAsNumber = (value) => {
  if (isNumeric(value)) return +value
  if ([undefined, ''].includes(value)) return null
  return value
}

export default ifIsNumericAsNumber
