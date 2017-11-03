// @flow
export default (bounds: Array) => {
  // only buffer if points are very close
  if (bounds.length === 2) {
    const b1 = bounds[0]
    const b2 = bounds[1]
    if (
      b1[0] &&
      b2[0] &&
      b1[0] === b2[0] &&
      b1[1] &&
      b2[1] &&
      b1[1] === b2[1]
    ) {
      // TODO: buffer
    }
    return bounds
  }
  return bounds
}
