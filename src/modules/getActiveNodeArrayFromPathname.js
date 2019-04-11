export default pathNamePassed => {
  const pathName = pathNamePassed || window.location.pathname.replace('/', '')
  // need to decode because of Umlaute in Aktionspläne
  const pathElements = pathName.split('/').map(e => decodeURIComponent(e))
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
