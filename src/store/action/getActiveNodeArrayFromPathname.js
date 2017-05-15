// @flow
export default (): Array<number | string> => {
  const pathName = window.location.pathname.replace('/', '')
  const pathElements = pathName.split('/')
  if (pathElements[0] === 'v2') {
    // get rid of empty element(s) at start
    pathElements.shift()
  }
  if (pathElements[0] === '') {
    // get rid of empty element(s) at start
    pathElements.shift()
  }
  // convert numbers to numbers
  // //stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
  pathElements.forEach((e, index) => {
    if (!isNaN(e)) {
      pathElements[index] = +e
    }
  })
  return pathElements
}
