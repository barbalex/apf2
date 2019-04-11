export default arrayOfBoundsPassed => {
  // remove array elements that are not arrays
  const arrayOfBounds = arrayOfBoundsPassed.filter(b => b && b.length)
  const xMinArray = arrayOfBounds.map(b => b[0][0])
  const yMinArray = arrayOfBounds.map(b => b[0][1])
  const xMaxArray = arrayOfBounds.map(b => b[1][0])
  const yMaxArray = arrayOfBounds.map(b => b[1][1])
  const xMin = Math.min(...xMinArray)
  const yMin = Math.min(...yMinArray)
  const xMax = Math.max(...xMaxArray)
  const yMax = Math.max(...yMaxArray)

  return [[xMin, yMin], [xMax, yMax]]
}
