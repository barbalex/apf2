/**
 * Gets an array of query results passed
 * returns true if any of them returns permission denied
 */
const existsPermissionError = (errors) => {
  //console.log('existsPermissionError, errors:', errors)
  if (!errors) {
    //console.log('existsPermissionError, !errors')
    return false
  }
  if (!errors.some) {
    //console.log('existsPermissionError, !errors.some')
    return false
  }
  //console.log('existsPermissionError, errors.some')
  const exists = errors.some(
    (error) =>
      error.message.includes('permission denied') ||
      error.message.includes('keine Berechtigung'),
  )
  //console.log('existsPermissionError, exists:', exists)
  return exists
}

export default existsPermissionError
