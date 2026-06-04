import { isNumeric } from './isNumeric.ts'

export const ifIsNumericAsNumber = (value) => {
  if (isNumeric(value)) return +value
  if ([undefined, ''].includes(value)) return null
  return value
}
