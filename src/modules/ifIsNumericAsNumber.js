// @flow

import isNumeric from './isNumeric'

export default value => (isNumeric(value) ? +value : value)
