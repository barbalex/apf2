export default bounds => {
  // only buffer if two points are identical
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
      const buffer = 0.003
      bounds = [
        [b1[0] - buffer, b1[1] - buffer],
        [b2[0] + buffer, b2[1] + buffer],
      ]
    }
  }

  return bounds
}
