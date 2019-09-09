/**
 * Gets an array of query results passed
 * returns true if any of them returns permission denied
 */
export default errors => {
  if (!errors) {
    console.log('existsPermissionError, errors:', errors)
    return false
  }
  if (!errors.some) {
    console.log('existsPermissionError, errors:', errors)
    return false
  }
  return errors.some(
    error =>
      error.message.includes('permission denied') ||
      error.message.includes('keine Berechtigung'),
  )
}
