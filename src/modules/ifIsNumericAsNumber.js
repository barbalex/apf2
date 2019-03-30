// @flow

import isNumeric from './isNumeric'

export default value => {
  if (isNumeric(value)) return +value
  if ([undefined, ''].includes(value)) return null
  return value
}
