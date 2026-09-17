import { isNumeric } from './isNumeric.ts'

export const ifIsNumericAsNumber = (value: unknown): number | string | null => {
  if (isNumeric(value)) return +(value as string)
  if (value === undefined || value === '') return null
  return value as number | string
}
